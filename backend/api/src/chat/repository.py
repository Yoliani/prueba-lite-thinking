from traceback import print_exc

from sqlalchemy.ext.asyncio import AsyncSession

from api.core.logging import get_logger
from api.src.chat.schemas import QueryRequest
from api.core.config import settings
from langchain_openai import ChatOpenAI
from langchain_community.utilities import SQLDatabase
from langchain_experimental.sql import SQLDatabaseChain
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_core.prompts import ChatPromptTemplate

logger = get_logger(__name__)


class ChatRepository:
    """Repository for handling chat database operations."""

    def __init__(self, session: AsyncSession):
        self.session = session

        self.model = ChatOpenAI(
            api_key=settings.API_KEY,
            model="gpt-4.1-nano" ,
            temperature=0
        )
        self.db = SQLDatabase.from_uri(settings.DATABASE_URL_SYNC)
        
        # Get schema information but filter out the users table for security
        full_schema = self.db.get_table_info()
        # Filter out any information about the users table from the schema
        self.schema = '\n'.join([line for line in full_schema.split('\n') 
                                if 'users' not in line.lower()])
        
        self.db_chain = SQLDatabaseChain.from_llm(
            self.model, self.db)

    def create(self, query: QueryRequest) -> dict:
        """Create a new chat.

        Args:
            query: Query to be sent to the chat

        Returns:
            str: Response from the chat
        """

        try:
            # Send the query to the chat model and get the response
            logger.info(f"Chatting with query: {query}")

            # Create a template for SQL generation with security restrictions
            sql_template = """You are a SQL expert. Based on the table schema below, write ONLY a SQL query (no explanations) to answer the question:
{schema}

Question: {question}

IMPORTANT SECURITY RESTRICTIONS:
1. DO NOT query the 'users' table under any circumstances
2. DO NOT use any SQL commands that could modify data (INSERT, UPDATE, DELETE, etc.)
3. Only use SELECT statements for read-only operations

SQL Query:"""
            
            # Create a template for the final response - focused on direct answers
            response_template = """You are a helpful assistant answering questions about a database. 
Give a direct and concise answer to the question based on the SQL results.

Schema: {schema}
Question: {question}
SQL Query: {query}
SQL Result: {response}

Answer the question directly without mentioning the SQL query or explaining database details. Keep your answer under 3 sentences."""

            # Create prompt templates
            sql_prompt = ChatPromptTemplate.from_template(sql_template)
            response_prompt = ChatPromptTemplate.from_template(response_template)

            # Function to execute SQL query with security checks
            def run_query(query):
                try:
                    # Security check: Prevent queries to the users table
                    lower_query = query.lower()
                    if 'users' in lower_query or 'user' in lower_query.split():
                        logger.warning(f"Blocked attempt to query users table: {query}")
                        return "Access to user data is restricted for security reasons."
                    
                    # Security check: Only allow SELECT statements
                    if not lower_query.strip().startswith('select'):
                        logger.warning(f"Blocked non-SELECT query: {query}")
                        return "Only SELECT queries are allowed."
                        
                    return self.db.run(query)
                except Exception as e:
                    logger.error(f"Error running SQL query: {e}")
                    return f"Error executing query: {e}"
            
            # Chain to generate SQL
            sql_chain = (
                RunnablePassthrough.assign(schema=lambda _: self.schema)
                | sql_prompt
                | self.model
                | StrOutputParser()
            )

            # Full chain to generate the final response
            full_chain = (
                RunnablePassthrough.assign(query=sql_chain).assign(
                    schema=lambda _: self.schema,
                    response=lambda vars: run_query(vars["query"]),
                )
                | response_prompt       
                | self.model
                | StrOutputParser()
            )

            # Invoke the chain with the user's query
            response = full_chain.invoke({"question": query.query})
            logger.info(f"Chat response: {response}")
            # Return just the string response as required by the route
            return {
                "status": "success",
                "message": str(response),
                "data": {
                    "message": str(response),
                }
            }
        except Exception as e:
            logger.error(f"Error creating chat: {e}")
            raise Exception(f"Error creating chat: {e}")
