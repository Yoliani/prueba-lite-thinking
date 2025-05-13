import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  Button,
  Space,
  Popconfirm,
  Input,
  Modal,
  Form,
  Typography,
  Spin,
  message,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

import Layout from "../../components/Layout";
import ProtectedRoute from "../../components/ProtectedRoute";
import {
  Company,
  CompanyCreate,
  CompanyUpdate,
} from "../../integrations/company/types";
import { useAuth } from "../../hooks/useAuth";
import { appClient } from "~/integrations";

export default function CompaniesContent() {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState<CompanyCreate>({
    nit: "",
    name: "",
    address: "",
    phone: "",
    email: "",
  });
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();

  // Fetch companies
  const {
    data: companies,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["companies"],
    queryFn: appClient.companyService.getCompanies,
  });

  // Create company mutation
  const createMutation = useMutation({
    mutationFn: appClient.companyService.createCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      handleCloseDialog();
      message.success("Empresa creada exitosamente");
    },
    onError: (error: any) => {
      message.error(`Error al crear empresa: ${error.message}`);
    },
  });

  // Update company mutation
  const updateMutation = useMutation({
    mutationFn: ({ nit, data }: { nit: string; data: CompanyUpdate }) =>
      appClient.companyService.updateCompany(nit, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      handleCloseDialog();
      message.success("Empresa actualizada exitosamente");
    },
    onError: (error: any) => {
      message.error(`Error al actualizar empresa: ${error.message}`);
    },
  });

  // Delete company mutation
  const deleteMutation = useMutation({
    mutationFn: appClient.companyService.deleteCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      message.success("Empresa eliminada exitosamente");
    },
    onError: (error: any) => {
      message.error(`Error al eliminar empresa: ${error.message}`);
    },
  });

  const handleOpenDialog = (company?: Company) => {
    if (company) {
      setEditingCompany(company);
      setFormData({
        nit: company.nit,
        name: company.name,
        address: company.address,
        phone: company.phone,
        email: company.email,
      });
    } else {
      setEditingCompany(null);
      setFormData({
        nit: "",
        name: "",
        address: "",
        phone: "",
        email: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCompany(null);
    setFormData({
      nit: "",
      name: "",
      address: "",
      phone: "",
      email: "",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // Validate NIT format for new companies
    if (!editingCompany && !/^\d{9}$/.test(formData.nit)) {
      message.error("El NIT debe contener exactamente 9 números");
      return;
    }

    if (editingCompany) {
      // For updates, we need to extract only the updatable fields
      const updateData: CompanyUpdate = {
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        email: formData.email
      };
      
      updateMutation.mutate({
        nit: editingCompany.nit,
        data: updateData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (nit: string) => {
    deleteMutation.mutate(nit);
  };

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 32 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Typography.Text type="danger" style={{ padding: 16, display: "block" }}>
        Error al cargar empresas: {(error as Error).message}
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
        }}
      >
        <Typography.Title level={4}>Empresas</Typography.Title>
        {isAdmin && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleOpenDialog()}
          >
            Agregar Empresa
          </Button>
        )}
      </div>

      <Table
        dataSource={companies}
        rowKey="nit"
        columns={[
          {
            title: "NIT",
            dataIndex: "nit",
            key: "nit",
          },
          {
            title: "Nombre",
            dataIndex: "name",
            key: "name",
          },
          {
            title: "Correo",
            dataIndex: "email",
            key: "email",
          },
          {
            title: "Dirección",
            dataIndex: "address",
            key: "address",
          },
          {
            title: "Teléfono",
            dataIndex: "phone",
            key: "phone",
          },
          isAdmin
            ? {
                title: "Acciones",
                key: "actions",
                align: "right" as const,
                render: (_, record) => (
                  <Space>
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => handleOpenDialog(record)}
                    />
                    <Popconfirm
                      title="¿Está seguro que desea eliminar esta empresa?"
                      onConfirm={() => handleDelete(record.nit)}
                      okText="Sí"
                      cancelText="No"
                    >
                      <Button type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                  </Space>
                ),
              }
            : {},
        ].filter((column) => Object.keys(column).length > 0)}
      />

      <Modal
        title={editingCompany ? "Editar Empresa" : "Agregar Empresa"}
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
          <Form.Item 
            label="NIT" 
            required 
            help="Coloca tu NIT con el número de verificación sin el guion"
            validateStatus={!editingCompany && formData.nit && !/^\d{9}$/.test(formData.nit) ? "error" : undefined}
          >
            <Input
              name="nit"
              value={formData.nit}
              onChange={handleInputChange}
              disabled={!!editingCompany}
              maxLength={9}
              onKeyPress={(e) => {
                // Only allow digits
                const isDigit = /\d/.test(e.key);
                if (!isDigit) {
                  e.preventDefault();
                }
              }}
            />
          </Form.Item>
          <Form.Item label="Nombre de la Empresa" required>
            <Input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </Form.Item>
          <Form.Item label="Email" required>
            <Input
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </Form.Item>
          <Form.Item label="Dirección" required>
            <Input
              name="address"
              value={formData.address}
              onChange={handleInputChange}
            />
          </Form.Item>
          <Form.Item label="Teléfono" required>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
