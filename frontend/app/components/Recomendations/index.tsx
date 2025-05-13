// Chat-based interface for the RecommendationsPage component
import {
  Typography,
  Input,
  Button,
  Card,
  Spin,
  Tag,
  Rate,
  Divider,
  Row,
  Col,
  Alert,
  Avatar,
  List,
  Space,
} from "antd";
import {
  SendOutlined,
  BulbOutlined,
  UserOutlined,
  RobotOutlined,
  ShoppingOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import Layout from "../../components/Layout";
import ProtectedRoute from "../../components/ProtectedRoute";
import { animate, stagger } from "motion";
import { appClient } from "../../integrations";
import AnimatedComponent from "../../components/AnimatedComponent";
// i18n removed

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;


export default function RecommendationsContent() {
  // i18n removed
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState<
    Array<{ type: "user" | "assistant"; content: string }>
  >([]);
  const [recommendations, setRecommendations] = useState<any>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<any>(null);

  const recommendationMutation = useMutation({
    mutationFn: appClient.chatService.sendMessage,
    onSuccess: (data) => {
      setRecommendations(data);

      // Add assistant response to chat history
      setChatHistory((prev) => [
        ...prev,
        {
          type: "assistant",
          content: data.message || "No se encontraron recomendaciones",
        },
      ]);

      setTimeout(() => {
        if (cardsRef.current) {
          const cards = Array.from(
            cardsRef.current.querySelectorAll(".recommendation-card")
          );
          animate(
            cards,
            { opacity: [0, 1], y: [20, 0] },
            { duration: 0.5, delay: stagger(0.1) }
          );
        }
        // Scroll to bottom of chat
        scrollToBottom();
      }, 100);
      appClient.logger("Recomendaciones obtenidas exitosamente", "success");
    },
    onError: (error: any) => {
      // Add error message to chat history
      setChatHistory((prev) => [
        ...prev,
        { type: "assistant", content: `Error: ${error.message}` },
      ]);
      setError(error);
      scrollToBottom();
      appClient.logger(
        `Error al obtener recomendaciones: ${error.message}`,
        "error"
      );
    },
  });

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Scroll to bottom whenever chat history changes
    scrollToBottom();
  }, [chatHistory]);

  const handleSearch = () => {
    if (!query.trim()) return;

    // Add user query to chat history
    setChatHistory((prev) => [...prev, { type: "user", content: query }]);

    // Send query to API
    recommendationMutation.mutate(query);

    // Clear input field
    setQuery("");

    // Focus input field again
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 120px)",
      }}
    >
      <AnimatedComponent
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <Title level={2}>Asistente de IA</Title>
          <Paragraph style={{ maxWidth: 700, margin: "0 auto" }}>
            Haga preguntas sobre productos o empresas para recibir
            recomendaciones personalizadas basadas en sus necesidades.
          </Paragraph>
        </div>

        {/* Chat messages container */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px",
            background: "#f5f5f5",
            borderRadius: "8px",
            marginBottom: "16px",
            minHeight: "400px",
            maxHeight: "calc(100vh - 280px)",
          }}
        >
          {/* Welcome message */}
          {chatHistory.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <Avatar
                size={64}
                icon={<RobotOutlined />}
                style={{ backgroundColor: "#1976d2", marginBottom: 16 }}
              />
              <Title level={4}>Bienvenido al asistente de IA</Title>
              <Paragraph>
                Envíe preguntas sobre productos o empresas para recibir
                recomendaciones personalizadas basadas en sus necesidades.
              </Paragraph>
              <Space>
                <Button
                  onClick={() =>
                    setQuery(
                      "¿Qué productos recomiendas para una pequeña oficina?"
                    )
                  }
                >
                  Suministros de oficina
                </Button>
                <Button
                  onClick={() =>
                    setQuery("Necesito equipo para edición de video")
                  }
                >
                  Equipo de video
                </Button>
                <Button
                  onClick={() =>
                    setQuery("¿Cuáles son tus productos más vendidos?")
                  }
                >
                  Más vendidos
                </Button>
              </Space>
            </div>
          )}

          {/* Chat messages */}
          <List
            itemLayout="horizontal"
            dataSource={chatHistory}
            renderItem={(message, index) => (
              <AnimatedComponent
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <List.Item style={{ padding: "8px 0" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection:
                        message.type === "user" ? "row-reverse" : "row",
                      alignItems: "flex-start",
                      width: "100%",
                    }}
                  >
                    <Avatar
                      icon={
                        message.type === "user" ? (
                          <UserOutlined />
                        ) : (
                          <RobotOutlined />
                        )
                      }
                      style={{
                        backgroundColor:
                          message.type === "user" ? "#87d068" : "#1976d2",
                        margin:
                          message.type === "user" ? "0 0 0 12px" : "0 12px 0 0",
                      }}
                    />
                    <Card
                      style={{
                        maxWidth: "80%",
                        backgroundColor:
                          message.type === "user" ? "#dcf8c6" : "white",
                        borderRadius: "8px",
                      }}
                      bodyStyle={{ padding: "12px 16px" }}
                    >
                      <div>{message.content}</div>
                    </Card>
                  </div>
                </List.Item>
              </AnimatedComponent>
            )}
          />

          {/* Loading indicator */}
          {recommendationMutation.isPending && (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <Spin tip="Pensando..." />
              <div style={{ marginTop: 8 }}>Procesando su solicitud...</div>
            </div>
          )}

          {/* Anchor for scrolling to bottom */}
          <div ref={chatEndRef} />
        </div>

        {/* Input area */}
        <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
          <Input
            ref={inputRef as any}
            placeholder="Pregunte sobre productos o empresas"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{ flex: 1 }}
            size="large"
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSearch}
            disabled={recommendationMutation.isPending || !query.trim()}
            size="large"
          >
            {recommendationMutation.isPending ? "Enviando..." : "Enviar"}
          </Button>
        </div>

        {recommendations && (
          <div ref={cardsRef}>
            {/* Product recommendations */}

            {recommendations.recommendations?.products?.length > 0 && (
              <Card
                title={
                  <>
                    <ShoppingOutlined /> Productos Recomendados
                  </>
                }
                style={{ marginTop: 24 }}
              >
                <Row gutter={[24, 24]}>
                  {recommendations.recommendations.products.map(
                    (product: any, index: number) => (
                      <Col xs={24} md={12} lg={8} key={product.id || index}>
                        <Card
                          className="recommendation-card"
                          style={{ opacity: 0 }}
                          hoverable
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: 8,
                            }}
                          >
                            <Title level={5}>{product.name}</Title>
                            <Text strong>Código:</Text> {product.code}
                          </div>
                          <Paragraph>{product.characteristics}</Paragraph>
                          <Divider />
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <span style={{ marginRight: 8 }}>
                              Puntuación de coincidencia:
                            </span>
                            <Rate
                              allowHalf
                              disabled
                              value={product.score / 20}
                            />
                            <span style={{ marginLeft: 8 }}>
                              ({Math.round(product.score)}%)
                            </span>
                          </div>
                        </Card>
                      </Col>
                    )
                  )}
                </Row>
              </Card>
            )}

            {recommendations.recommendations?.companies?.length > 0 && (
              <Card
                title={
                  <>
                    <ShopOutlined /> Empresas Recomendadas
                  </>
                }
                style={{ marginTop: 24 }}
              >
                <Row gutter={[24, 24]}>
                  {recommendations.recommendations.companies.map(
                    (company: any, index: number) => (
                      <Col xs={24} md={12} lg={8} key={company.nit || index}>
                        <Card
                          className="recommendation-card"
                          style={{ opacity: 0 }}
                          hoverable
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: 8,
                            }}
                          >
                            <Title level={5}>{company.name}</Title>
                            <Tag color="purple">{company.nit}</Tag>
                          </div>
                          <Divider />
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <span style={{ marginRight: 8 }}>
                              Puntuación de coincidencia:
                            </span>
                            <Rate
                              allowHalf
                              disabled
                              value={company.score / 20}
                            />
                            <span style={{ marginLeft: 8 }}>
                              ({Math.round(company.score)}%)
                            </span>
                          </div>
                        </Card>
                      </Col>
                    )
                  )}
                </Row>
              </Card>
            )}

            {
              error && (
                <div style={{ textAlign: "center", padding: 32 }}>
                  <Alert
                    type="info"
                    message="No se encontraron recomendaciones para su consulta. Intente con un término de búsqueda diferente."
                  />
                </div>
              )
            }
          </div>
        )}
      </AnimatedComponent>
    </div>
  );
}
