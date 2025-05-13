import { useState } from "react";
import { useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  Button,
  Space,
  Popconfirm,
  Input,
  Select,
  Modal,
  Form,
  Typography,
  Spin,
  message,
  Tooltip,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  MailOutlined,
} from "@ant-design/icons";

import Layout from "../../components/Layout";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../hooks/useAuth";
import apiClient from "../../services/api-client";
import type {
  InventoryItem,
  InventoryItemCreate,
  InventoryItemUpdate,
} from "../../integrations/inventory/types";
import { appClient } from "~/integrations";



export default function InventoryContent() {
  const [openDialog, setOpenDialog] = useState(false);
  const [openEmailDialog, setOpenEmailDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState<{
    product_id: number | undefined;
    quantity: number;
  }>({
    product_id: undefined,
    quantity: 0,
  });
  const [email, setEmail] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  // Using Ant Design message for notifications
  const queryClient = useQueryClient();

  // Fetch inventory items
  const {
    data: inventoryItems,
    isLoading: isLoadingInventory,
    error: inventoryError,
  } = useQuery({
    queryKey: ["inventory"],
    queryFn: appClient.inventoryService.getInventoryItems,
  });

  // Fetch products
  const {
    data: products,
    isLoading: isLoadingProducts,
    error: productsError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: appClient.productService.getProducts,
  });

  // Fetch companies
  const {
    data: companies,
    isLoading: isLoadingCompanies,
    error: companiesError,
  } = useQuery({
    queryKey: ["companies"],
    queryFn: appClient.companyService.getCompanies,
  });

  // Create inventory item mutation
  const createMutation = useMutation({
    mutationFn: appClient.inventoryService.createInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      handleCloseDialog();
      message.success("Artículo de inventario creado exitosamente");
    },
    onError: (error: any) => {
      message.error(`Error al crear artículo de inventario: ${error.message}`);
    },
  });

  // Update inventory item mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: InventoryItem }) =>
      appClient.inventoryService.updateInventoryItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      handleCloseDialog();
      message.success("Artículo de inventario actualizado exitosamente");
    },
    onError: (error: any) => {
      message.error(
        `Error al actualizar artículo de inventario: ${error.message}`
      );
    },
  });

  // Delete inventory item mutation
  const deleteMutation = useMutation({
    mutationFn: appClient.inventoryService.deleteInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      message.success("Artículo de inventario eliminado exitosamente");
    },
    onError: (error: any) => {
      message.error(
        `Error al eliminar artículo de inventario: ${error.message}`
      );
    },
  });

  // Email report mutation
  const emailReportMutation = useMutation({
    mutationFn: ({
      email,
      companyNit,
    }: {
      email: string;
      companyNit?: string;
    }) => appClient.inventoryService.emailInventoryReport(email, companyNit),
    onSuccess: () => {
      setOpenEmailDialog(false);
      setEmail("");
      message.success(
        "El reporte de inventario será enviado a su correo en breve"
      );
    },
    onError: (error: any) => {
      message.error(`Error al enviar correo: ${error.message}`);
    },
  });

  // Filter inventory items based on selected company
  const filteredInventoryItems =
    selectedCompany && inventoryItems
      ? inventoryItems.filter(
          (item: InventoryItem) =>
            products?.find((p: any) => p.id === item.product_id)
              ?.company_nit === selectedCompany
        )
      : inventoryItems;

  const handleOpenDialog = (item?: InventoryItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        product_id: item.product_id,
        quantity: item.quantity,
      });
    } else {
      setEditingItem(null);
      setFormData({
        product_id: undefined,
        quantity: 0,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingItem(null);
    setFormData({
      quantity: 0,
      product_id: 0,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value) : value,
    }));
  };

  // Product selection is now handled directly in the Select onChange

  const handleSubmit = () => {
    if (editingItem) {
      updateMutation.mutate({
        id: editingItem.id,
        data: {
          quantity: formData.quantity,
          product_id: formData.product_id || 0,
        } as InventoryItemUpdate,
      });
    } else {
      createMutation.mutate({
        quantity: formData.quantity,
        product_id: formData.product_id || 0,
      } as InventoryItemCreate);
    }
  };

  const handleDelete = (id: number) => {
    if (
      window.confirm("Are you sure you want to delete this inventory item?")
    ) {
      deleteMutation.mutate(id);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const blob = await appClient.inventoryService.downloadInventoryReport(
        selectedCompany || undefined
      );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "inventory_report.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showSnackbar("Reporte descargado exitosamente", "success");
    } catch (error: any) {
      showSnackbar(`Error al descargar reporte: ${error.message}`, "error");
    }
  };

  const handleSendEmail = () => {
    if (!email) {
      showSnackbar(
        "Por favor, ingrese una dirección de correo electrónico",
        "error"
      );
      return;
    }
    emailReportMutation.mutate({
      email,
      companyNit: selectedCompany || undefined,
    });
  };

  const getProductName = (productId: number) => {
    return (
      products?.find((product: any) => product.id === productId)?.name ||
      `Product #${productId}`
    );
  };

  const getCompanyForProduct = (productId: number) => {
    const product = products?.find((product: any) => product.id === productId);
    if (!product) return "Unknown";

    const company = companies?.find((c: any) => c.nit === product.company_nit);
    return company?.name || product.company_nit;
  };

  const showSnackbar = (messageText: string, severity: "success" | "error") => {
    message[severity === "success" ? "success" : "error"](messageText);
  };

  if (isLoadingInventory || isLoadingProducts || isLoadingCompanies) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 32 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (inventoryError || productsError || companiesError) {
    return (
      <Typography.Text type="danger" style={{ padding: 16, display: "block" }}>
        Error al cargar datos. Por favor, intente más tarde.
      </Typography.Text>
    );
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        <Typography.Title level={4}>Inventario</Typography.Title>
        <div style={{ display: "flex", gap: 16 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleOpenDialog()}
            className="hover-button"
          >
            Agregar Artículo
          </Button>
        </div>
      </div>

      <div
        style={{
          marginBottom: 24,
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <Select
          placeholder="Filter by company"
          value={selectedCompany || undefined}
          onChange={(value) => setSelectedCompany(value)}
          allowClear
          style={{ width: 200 }}
        >
          {companies?.map((company: any) => (
            <Select.Option key={company.nit} value={company.nit}>
              {company.name}
            </Select.Option>
          ))}
        </Select>

        <Button
          icon={<DownloadOutlined />}
          onClick={handleDownloadReport}
          className="hover-button"
        >
          Descargar Reporte
        </Button>

        <Button
          icon={<MailOutlined />}
          onClick={() => setOpenEmailDialog(true)}
          className="hover-button"
        >
          Enviar Reporte por Email
        </Button>
      </div>

      <Table
        dataSource={filteredInventoryItems}
        rowKey="id"
        columns={[
          {
            title: "ID",
            dataIndex: "id",
            key: "id",
          },
          {
            title: "Producto",
            dataIndex: "product_id",
            key: "product",
            render: (productId) => getProductName(productId),
          },
          {
            title: "Empresa",
            dataIndex: "product_id",
            key: "company",
            render: (productId) => getCompanyForProduct(productId),
          },
          {
            title: "Cantidad",
            dataIndex: "quantity",
            key: "quantity",
          },
          {
            title: "Acciones",
            key: "actions",
            align: "right" as const,
            render: (_, record) => (
              <Space>
                <Tooltip title="Editar">
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => handleOpenDialog(record)}
                  />
                </Tooltip>
                <Tooltip title="Eliminar">
                  <Popconfirm
                    title="¿Está seguro que desea eliminar este artículo?"
                    onConfirm={() => deleteMutation.mutate(record.id)}
                    okText="Sí"
                    cancelText="No"
                  >
                    <Button type="text" danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </Tooltip>
              </Space>
            ),
          },
        ]}
      />

      {/* Add/Edit Inventory Item Modal */}
      <Modal
        title={
          editingItem
            ? "Editar Artículo de Inventario"
            : "Agregar Artículo de Inventario"
        }
        open={openDialog}
        onCancel={handleCloseDialog}
        footer={[
          <Button key="cancel" onClick={handleCloseDialog}>
            Cancelar
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={createMutation.isPending || updateMutation.isPending}
            onClick={handleSubmit}
          >
            {createMutation.isPending || updateMutation.isPending
              ? "Guardando..."
              : "Guardar"}
          </Button>,
        ]}
      >
        <Form layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item label="Producto" required>
            <Select
              value={formData.product_id || undefined}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, product_id: value }))
              }
              placeholder="Seleccionar un producto"
            >
              {products?.map((product: any) => (
                <Select.Option key={product.id} value={product.id}>
                  {product.name} ({getCompanyForProduct(product.id)})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Cantidad" required>
            <Input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              min={0}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Email Report Modal */}
      <Modal
        title="Enviar Reporte de Inventario por Email"
        open={openEmailDialog}
        onCancel={() => setOpenEmailDialog(false)}
        footer={[
          <Button key="cancel" onClick={() => setOpenEmailDialog(false)}>
            Cancelar
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={emailReportMutation.isPending}
            onClick={handleSendEmail}
          >
            {emailReportMutation.isPending ? "Enviando..." : "Enviar Email"}
          </Button>,
        ]}
      >
        <Form layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item label="Correo Electrónico" required>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>
          {selectedCompany && (
            <Typography.Text
              type="secondary"
              style={{ display: "block", marginTop: 8 }}
            >
              El reporte será filtrado para la empresa:{" "}
              {companies?.find((c: any) => c.nit === selectedCompany)?.name}
            </Typography.Text>
          )}
        </Form>
      </Modal>
    </div>
  );
}
