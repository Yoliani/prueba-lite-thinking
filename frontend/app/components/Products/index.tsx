import { Suspense, useState } from "react";
import {
  Table,
  Button,
  Space,
  Popconfirm,
  Modal,
  Form,
  Input,
  Select,
  Typography,
  Spin,
  Card,
  InputNumber,
  Divider,
  Tag,
  Empty,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Layout from "../../components/Layout";
import ProtectedRoute from "../../components/ProtectedRoute";
import { appClient } from "../../integrations";
import { useAuth } from "../../hooks/useAuth";

const { Title } = Typography;


export default function ProductsContent() {
  const [form] = Form.useForm();
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [searchText, setSearchText] = useState("");
  const [filterCompany, setFilterCompany] = useState<string | null>(null);

  // Fetch products and companies data
  const {
    data: products,
    isLoading: isLoadingProducts,
    error: productsError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: appClient.productService.getProducts,
  });

  const { data: companies, isLoading: isLoadingCompanies } = useQuery({
    queryKey: ["companies"],
    queryFn: appClient.companyService.getCompanies,
  });

  // Create product mutation
  const createMutation = useMutation({
    mutationFn: appClient.productService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      handleClose();
      appClient.logger("Producto creado exitosamente", "success");
    },
    onError: (error: any) => {
      appClient.logger(`Error al crear producto: ${error.message}`, "error");
    },
  });

  // Update product mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      appClient.productService.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      handleClose();
      appClient.logger("Producto actualizado exitosamente", "success");
    },
    onError: (error: any) => {
      appClient.logger(
        `Error al actualizar producto: ${error.message}`,
        "error"
      );
    },
  });

  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: appClient.productService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      appClient.logger("Producto eliminado exitosamente", "success");
    },
    onError: (error: any) => {
      appClient.logger(`Error al eliminar producto: ${error.message}`, "error");
    },
  });

  // Handle opening the product form modal
  const handleOpen = (product?: any) => {
    if (product) {
      setEditingProduct(product);
      console.log("Editing product with prices:", product.prices);

      // Ensure prices is properly formatted as Record<string, number>
      const typedPrices: Record<string, number> = {};
      if (product.prices && typeof product.prices === "object") {
        Object.entries(product.prices).forEach(([currency, price]) => {
          typedPrices[currency] =
            typeof price === "number" ? price : parseFloat(String(price));
        });
      }

      form.setFieldsValue({
        code: product.code,
        name: product.name,
        characteristics: product.characteristics,
        prices: typedPrices,
        company_nit: product.company_nit,
      });
    } else {
      setEditingProduct(null);
      // Initialize with default prices
      const defaultPrices: Record<string, number> = {
        USD: 0,
        COP: 0,
      };
      console.log("Creating new product with default prices:", defaultPrices);
      form.resetFields();
      form.setFieldsValue({ prices: defaultPrices });
    }
    setModalVisible(true);
  };

  // Handle closing the product form modal
  const handleClose = () => {
    setModalVisible(false);
    setEditingProduct(null);
    form.resetFields();
  };

  // Handle form submission
  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        // Get prices directly from the form and ensure it's a Record<string, number>
        const rawPrices = form.getFieldValue("prices") || {};
        console.log("Raw prices from form:", rawPrices);

        // Create a properly typed prices object
        const formattedPrices: Record<string, number> = {};

        // Convert all values to numbers and include all prices
        if (typeof rawPrices === "object") {
          Object.entries(rawPrices).forEach(([currency, price]) => {
            // Convert to number and ensure it's a valid number
            const numericPrice =
              typeof price === "number" ? price : parseFloat(String(price));
            // Only include non-zero prices
            if (!isNaN(numericPrice) && numericPrice > 0) {
              formattedPrices[currency] = numericPrice;
            }
          });
        }

        // If no prices were added, include at least one default price
        if (Object.keys(formattedPrices).length === 0) {
          formattedPrices.USD = 0;
        }

        console.log("Formatted prices:", formattedPrices);

        // Create the final values object with properly typed prices
        const formattedValues = {
          ...values,
          prices: formattedPrices as Record<string, number>,
        };

        // Remove any pricesList field if it exists (we don't need to send it)
        delete formattedValues.pricesList;

        console.log("Final product data:", formattedValues);

        if (editingProduct) {
          updateMutation.mutate({
            id: editingProduct.id,
            data: formattedValues,
          });
        } else {
          createMutation.mutate(formattedValues);
        }
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  // Handle search input change
  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  // Handle company filter change
  const handleCompanyFilter = (value: string | null) => {
    setFilterCompany(value);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchText("");
    setFilterCompany(null);
  };

  // Filter products based on search text and company filter
  const filteredProducts = products
    ? products.filter((product) => {
        const matchesSearch = searchText
          ? product.name.toLowerCase().includes(searchText.toLowerCase()) ||
            product.code.toLowerCase().includes(searchText.toLowerCase()) ||
            product.characteristics
              .toLowerCase()
              .includes(searchText.toLowerCase())
          : true;

        const matchesCompany = filterCompany
          ? product.company_nit === filterCompany
          : true;

        return matchesSearch && matchesCompany;
      })
    : [];

  // Show loading state
  if (isLoadingProducts || isLoadingCompanies) {
    return (
      <Card className="shadow-sm">
        <div style={{ display: "flex", justifyContent: "center", padding: 32 }}>
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  // Show error state
  if (productsError) {
    return (
      <Card className="shadow-sm" style={{ borderColor: "#ff4d4f" }}>
        <Typography.Text
          type="danger"
          style={{ padding: 16, display: "block" }}
        >
          <InfoCircleOutlined /> Error al cargar productos:{" "}
          {(productsError as Error).message}
        </Typography.Text>
      </Card>
    );
  }

  return (
    <div>
      <Card
        className="shadow-sm"
        style={{ marginBottom: 24 }}
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Title level={4} style={{ margin: 0 }}>
              Productos
              <span
                style={{ fontSize: "14px", marginLeft: 8, color: "#1976d2" }}
              >
                ({filteredProducts.length})
              </span>
            </Title>
            <Space>
              {isAdmin && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => handleOpen()}
                >
                  Agregar Producto
                </Button>
              )}
            </Space>
          </div>
        }
        extra={
          <Space>
            <Input
              placeholder="Buscar productos"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 200 }}
            />
            <Select
              placeholder="Filtrar por empresa"
              style={{ width: 200 }}
              allowClear
              value={filterCompany}
              onChange={handleCompanyFilter}
              options={
                companies
                  ? companies.map((company: any) => ({
                      value: company.nit,
                      label: company.name,
                    }))
                  : []
              }
            />
            <Tooltip title="Reiniciar filtros">
              <Button
                icon={<ReloadOutlined />}
                onClick={resetFilters}
                disabled={!searchText && !filterCompany}
              />
            </Tooltip>
          </Space>
        }
      >
        <Table
          dataSource={filteredProducts}
          rowKey="id"
          columns={[
            {
              title: "Código",
              dataIndex: "code",
              key: "code",
              sorter: (a: any, b: any) => a.code.localeCompare(b.code),
            },
            {
              title: "Nombre",
              dataIndex: "name",
              key: "name",
              sorter: (a: any, b: any) => a.name.localeCompare(b.name),
            },
            {
              title: "Características",
              dataIndex: "characteristics",
              key: "characteristics",
              ellipsis: true,
              width: 200,
            },
            {
              title: "Precios",
              dataIndex: "prices",
              key: "prices",
              render: (prices: any) => {
                // Currency symbols mapping
                const symbols: Record<string, string> = {
                  USD: "$",
                  COP: "$",
                  EUR: "€",
                  GBP: "£",
                  JPY: "¥",
                  CAD: "C$",
                  AUD: "A$",
                  CHF: "Fr",
                  CNY: "¥",
                  MXN: "$",
                  BRL: "R$",
                  ARS: "$",
                  CLP: "$",
                  PEN: "S/",
                };

                // Format price with appropriate symbol and thousands separator
                const formatPrice = (currency: string, price: number) => {
                  const symbol = symbols[currency] || currency;
                  let formattedPrice = price.toLocaleString(undefined, {
                    minimumFractionDigits: currency === "JPY" ? 0 : 2,
                    maximumFractionDigits: currency === "JPY" ? 0 : 2,
                  });
                  return `${symbol} ${formattedPrice}`;
                };

                return (
                  <Space
                    direction="vertical"
                    size="small"
                    style={{ minWidth: "120px" }}
                  >
                    {Object.entries(prices).map(
                      ([currency, price]: [string, any]) => (
                        <Tag
                          color="blue"
                          key={currency}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                          <span
                            style={{ marginRight: "8px", fontWeight: "bold" }}
                          >
                            {currency}:
                          </span>
                          <span>{formatPrice(currency, price)}</span>
                        </Tag>
                      )
                    )}
                  </Space>
                );
              },
            },
            {
              title: "Empresa",
              dataIndex: "company_nit",
              key: "company_nit",
              filters: companies
                ? companies.map((company: any) => ({
                    text: company.name,
                    value: company.nit,
                  }))
                : [],
              onFilter: (value: any, record: any) =>
                record.company_nit === value,
              render: (nit: string) => {
                const company = companies
                  ? companies.find((c: any) => c.nit === nit)
                  : null;
                return company ? <Tag color="green">{company.name}</Tag> : nit;
              },
            },
            isAdmin
              ? {
                  title: "Acciones",
                  key: "actions",
                  align: "right" as const,
                  render: (_: any, record: any) => (
                    <Space>
                      <Tooltip title="Editar producto">
                        <Button
                          type="primary"
                          ghost
                          icon={<EditOutlined />}
                          onClick={() => handleOpen(record)}
                          shape="circle"
                        />
                      </Tooltip>
                      <Popconfirm
                        title="¿Está seguro que desea eliminar este producto?"
                        description="Esta acción no se puede deshacer"
                        onConfirm={() => deleteMutation.mutate(record.id)}
                        okText="Sí"
                        cancelText="No"
                        okButtonProps={{ danger: true }}
                      >
                        <Tooltip title="Eliminar producto">
                          <Button
                            danger
                            icon={<DeleteOutlined />}
                            shape="circle"
                          />
                        </Tooltip>
                      </Popconfirm>
                    </Space>
                  ),
                }
              : {},
          ].filter((column) => Object.keys(column).length > 0)}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total: ${total} productos`,
          }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No hay productos disponibles"
              />
            ),
          }}
        />
      </Card>
      <Modal
        title={editingProduct ? "Editar Producto" : "Agregar Producto"}
        open={modalVisible}
        onCancel={handleClose}
        onOk={() => form.submit()}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 16 }}
          initialValues={{
            prices: {
              USD: 0,
              COP: 0,
            } as Record<string, number>,
          }}
          onFinish={handleSubmit}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <Form.Item
              name="code"
              label="Código"
              rules={[
                { required: true, message: "Por favor ingrese el código" },
              ]}
            >
              <Input disabled={!!editingProduct} placeholder="Ej. PROD-001" />
            </Form.Item>

            <Form.Item
              name="name"
              label="Nombre"
              rules={[
                { required: true, message: "Por favor ingrese el nombre" },
              ]}
            >
              <Input placeholder="Nombre del producto" />
            </Form.Item>
          </div>

          <Form.Item
            name="characteristics"
            label="Características"
            rules={[
              {
                required: true,
                message: "Por favor ingrese las características",
              },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Describa las características del producto"
            />
          </Form.Item>

          <Divider orientation="left">Precios</Divider>

          <Form.List name="pricesList">
            {(fields, { add, remove }) => {
              // Get the current prices from form
              const prices = form.getFieldValue("prices") || {};

              // Add default currencies if no prices exist
              if (Object.keys(prices).length === 0) {
                form.setFieldsValue({
                  prices: {
                    USD: 0,
                    COP: 0,
                  },
                });
              }

              return (
                <>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(250px, 1fr))",
                      gap: "16px",
                      marginBottom: "16px",
                    }}
                  >
                    {Object.entries(form.getFieldValue("prices") || {}).map(
                      ([currency, value], index) => (
                        <div
                          key={currency}
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <Form.Item
                            label={currency}
                            style={{ flex: 1, marginBottom: 0 }}
                          >
                            <InputNumber<number>
                              min={0}
                              step={
                                currency === "JPY"
                                  ? 1
                                  : currency === "COP"
                                  ? 1000
                                  : 0.01
                              }
                              style={{ width: "100%" }}
                              value={value as number}
                              onChange={(newValue) => {
                                // Directly update the prices object when value changes
                                const currentPrices = {
                                  ...form.getFieldValue("prices"),
                                } as Record<string, number>;
                                currentPrices[currency] =
                                  newValue !== null ? newValue : 0;
                                form.setFieldsValue({ prices: currentPrices });
                              }}
                              formatter={(value) => {
                                const symbols: Record<string, string> = {
                                  USD: "$",
                                  COP: "$",
                                  EUR: "€",
                                  GBP: "£",
                                  JPY: "¥",
                                };
                                const symbol = symbols[currency] || "$";
                                return value
                                  ? `${symbol} ${value}`.replace(
                                      /\B(?=(\d{3})+(?!\d))/g,
                                      ","
                                    )
                                  : "";
                              }}
                              parser={(value) => {
                                if (!value) return 0;
                                // Remove currency symbol and commas
                                return parseFloat(
                                  value.replace(/[^\d.-]/g, "")
                                );
                              }}
                              placeholder={`Precio en ${currency}`}
                            />
                          </Form.Item>
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => {
                              const currentPrices = {
                                ...form.getFieldValue("prices"),
                              };
                              delete currentPrices[currency];
                              form.setFieldsValue({ prices: currentPrices });
                              // Force re-render
                              form.validateFields(["prices"]);
                            }}
                            style={{ marginLeft: 8 }}
                          />
                        </div>
                      )
                    )}
                  </div>

                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => {
                        // Show modal to add new currency
                        Modal.confirm({
                          title: "Agregar nueva moneda",
                          content: (
                            <div>
                              <Select
                                style={{ width: "100%", marginBottom: 16 }}
                                placeholder="Seleccione una moneda"
                                id="newCurrencySelect"
                              >
                                {[
                                  {
                                    value: "USD",
                                    label: "Dólar estadounidense (USD)",
                                  },
                                  {
                                    value: "COP",
                                    label: "Peso colombiano (COP)",
                                  },
                                  { value: "EUR", label: "Euro (EUR)" },
                                  {
                                    value: "GBP",
                                    label: "Libra esterlina (GBP)",
                                  },
                                  { value: "JPY", label: "Yen japonés (JPY)" },
                                  {
                                    value: "CAD",
                                    label: "Dólar canadiense (CAD)",
                                  },
                                  {
                                    value: "AUD",
                                    label: "Dólar australiano (AUD)",
                                  },
                                  { value: "CHF", label: "Franco suizo (CHF)" },
                                  { value: "CNY", label: "Yuan chino (CNY)" },
                                  {
                                    value: "MXN",
                                    label: "Peso mexicano (MXN)",
                                  },
                                  {
                                    value: "BRL",
                                    label: "Real brasileño (BRL)",
                                  },
                                  {
                                    value: "ARS",
                                    label: "Peso argentino (ARS)",
                                  },
                                  { value: "CLP", label: "Peso chileno (CLP)" },
                                  { value: "PEN", label: "Sol peruano (PEN)" },
                                ]
                                  .filter((currency) => {
                                    // Filter out currencies that are already added
                                    const currentPrices =
                                      form.getFieldValue("prices") || {};
                                    return !Object.keys(currentPrices).includes(
                                      currency.value
                                    );
                                  })
                                  .map((currency) => (
                                    <Select.Option
                                      key={currency.value}
                                      value={currency.value}
                                    >
                                      {currency.label}
                                    </Select.Option>
                                  ))}
                              </Select>
                              <Input
                                placeholder="O ingrese un código de moneda personalizado (ej: BOB)"
                                id="customCurrencyInput"
                              />
                            </div>
                          ),
                          onOk() {
                            const selectValue = (
                              document.getElementById(
                                "newCurrencySelect"
                              ) as HTMLSelectElement
                            )?.value;
                            const inputValue = (
                              document.getElementById(
                                "customCurrencyInput"
                              ) as HTMLInputElement
                            )?.value;

                            const currencyCode = selectValue || inputValue;
                            if (!currencyCode) return;

                            // Add new currency to prices
                            const currentPrices = {
                              ...form.getFieldValue("prices"),
                            };
                            if (!currentPrices[currencyCode]) {
                              currentPrices[currencyCode] = 0;
                              form.setFieldsValue({ prices: currentPrices });
                              // Force re-render
                              form.validateFields(["prices"]);
                            }
                          },
                        });
                      }}
                      icon={<PlusOutlined />}
                      block
                    >
                      Agregar moneda
                    </Button>
                  </Form.Item>
                </>
              );
            }}
          </Form.List>

          <Form.Item
            name="company_nit"
            label="Empresa"
            rules={[
              { required: true, message: "Por favor seleccione una empresa" },
            ]}
          >
            <Select
              placeholder="Seleccione una empresa"
              showSearch
              optionFilterProp="children"
            >
              {companies
                ? companies.map((company: any) => (
                    <Select.Option key={company.nit} value={company.nit}>
                      {company.name}
                    </Select.Option>
                  ))
                : null}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
