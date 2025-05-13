import os
import tempfile
from datetime import datetime
from pathlib import Path

from fastapi import HTTPException
from jinja2 import Environment, FileSystemLoader
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from weasyprint import HTML

from api.core.logging import get_logger
from api.src.companies.models import Company
from api.src.inventory.models import InventoryItem
from api.src.products.models import Product
import resend
from api.core.email import email_manager

from fastapi.responses import FileResponse

# Set up logger
logger = get_logger(__name__)

# Get the templates directory
TEMPLATES_DIR = Path(__file__).parent / "templates"


async def get_inventory_data(session: AsyncSession, company_nit: str = None):
    """Get inventory data for report."""
    # Query to join inventory items with products and companies
    if company_nit:
        query = (
            select(InventoryItem, Product, Company)
            .join(Product, InventoryItem.product_id == Product.id)
            .join(Company, Product.company_nit == Company.nit)
            .where(Company.nit == company_nit)
        )
    else:
        query = (
            select(InventoryItem, Product, Company)
            .join(Product, InventoryItem.product_id == Product.id)
            .join(Company, Product.company_nit == Company.nit)
        )

    result = await session.execute(query)
    rows = result.all()

    # Format data for the report
    data = []
    for inventory_item, product, company in rows:
        # Get the first price (usually USD) for display in the report
        price_currency, price_value = next(iter(product.prices.items()))

        data.append({
            "company_nit": company.nit,
            "company_name": company.name,
            "product_code": product.code,
            "product_name": product.name,
            "price": f"{price_currency} {price_value}",
            "quantity": inventory_item.quantity,
            "total_value": price_value * inventory_item.quantity
        })

    return data


async def generate_inventory_pdf(session: AsyncSession, company_nit: str = None):
    """Generate PDF report of inventory using WeasyPrint and HTML template."""
    # Get inventory data
    inventory_data = await get_inventory_data(session, company_nit)

    if not inventory_data:
        raise HTTPException(status_code=404, detail="No inventory data found")

    # Create a temporary file for the PDF
    fd, temp_path = tempfile.mkstemp(suffix=".pdf")
    os.close(fd)

    # Set up Jinja2 environment
    env = Environment(loader=FileSystemLoader(TEMPLATES_DIR))
    template = env.get_template("inventory_report.html")

    # Calculate totals
    total_quantity = sum(item["quantity"] for item in inventory_data)

    # For total value, we need to standardize to one currency
    # Here we'll use the first item's currency as the standard
    if inventory_data:
        currency = inventory_data[0]["price"].split()[0]
        total_value = f"{currency} {sum(item['total_value'] for item in inventory_data)}"
    else:
        total_value = "0"

    # Get company info if filtering by company
    company = None
    if company_nit:
        company_query = select(Company).where(Company.nit == company_nit)
        result = await session.execute(company_query)
        company = result.scalar_one_or_none()

    # Prepare template context
    title = "Inventory Report"
    if company:
        title += f" - {company.name}"

    context = {
        "title": title,
        "generation_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "inventory_data": inventory_data,
        "company": company,
        "total_quantity": total_quantity,
        "total_value": total_value,
        "current_year": datetime.now().year
    }

    # Render HTML
    html_content = template.render(**context)

    # Generate PDF
    HTML(string=html_content).write_pdf(temp_path)

    logger.info(f"Generated inventory PDF report at {temp_path}")
    return temp_path


async def send_pdf_by_email(session: AsyncSession, email_to: str, company_nit: str = None) -> bool:
    """Send inventory report PDF by email.

    This function generates a PDF report using WeasyPrint and sends it via email.
    In a production environment, you would use a proper email service like
    SendGrid, Mailgun, or AWS SES.

    Args:
        session: Database session
        email_to: Recipient email address
        company_nit: Optional company NIT to filter inventory by company

    Returns:
        bool: True if email was sent successfully

    Raises:
        HTTPException: If there's an error generating or sending the email
    """
    try:
        print("Generating inventory PDF report",
              session, email_to, company_nit)
        # Generate the PDF using WeasyPrint
        pdf_path = await generate_inventory_pdf(session, company_nit)

        # Get company name if company_nit is provided
        company_name = None
        if company_nit:
            company_query = select(Company).where(Company.nit == company_nit)
            result = await session.execute(company_query)
            company = result.scalar_one_or_none()
            if company:
                company_name = company.name

        # Email configuration
        email_from = "inventory@litethinkinginventory.com"
        email_subject = "Inventory Report"
        if company_name:
            email_subject += f" - {company_name}"

        email_body = f"""Dear User,

Please find attached the inventory report you requested on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}.

This report was generated automatically by the Lite Thinking Inventory System.

Best regards,
Lite Thinking Team
"""

        # Attach PDF
        f: bytes = open(
            pdf_path, "rb"
        ).read()
        attachment: resend.Attachment = {
            "content": list(f), "filename": "inventory_report.pdf"}

        await email_manager.send_email(
            email_to,
            email_subject,
            email_body,
            [
                attachment
            ]
        )

        # Clean up temporary file
        os.unlink(pdf_path)

        logger.info(f"Sent inventory report to {email_to} via resend")
        return True
    except Exception as e:
        logger.error(f"Error sending email: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error sending email: {str(e)}")
