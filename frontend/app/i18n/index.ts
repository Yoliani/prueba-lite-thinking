import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Cookie name for storing language preference (must match the one in LanguageSwitcher)

// Get the initial language from cookie or default to 'en'
const initialLanguage = "en";

// Import translations directly as objects
const enTranslation = {
  // Common
  app_title: "Inventory management",
  loading: "Loading...",
  error: "Error",
  save: "Save",
  cancel: "Cancel",
  delete: "Delete",
  edit: "Edit",
  add: "Add",
  actions: "Actions",
  filter: "Filter",
  search: "Search",
  confirmation: "Confirmation",
  yes: "Yes",
  no: "No",
  send: "Send",
  sending: "Sending...",
  saving: "Saving...",
  processing: "Processing...",
  thinking: "Thinking...",
  welcome: "Welcome",
  welcome_description:
    "A comprehensive solution for managing companies, products, and inventory",
  get_started: "Get Started",

  // Auth
  login: "Login",
  login_title: "Please log in to access all features",
  login_description:
    "External users can view companies, while admin users have full access to all features.",
  logout: "Logout",
  email: "Email",
  password: "Password",
  sign_in: "Sign In",
  register: "Register",
  create_account: "Create Account",
  welcome_back: "Welcome Back",
  login_successful: "Login successful",
  login_failed: "Login failed",
  registration_successful: "Registration successful",
  registration_failed: "Registration failed",
  email_password_required: "Email and password are required",
  invalid_credentials: "Invalid email or password",

  // Navigation
  dashboard: "Dashboard",
  companies: "Companies",
  products: "Products",
  inventory: "Inventory",
  reports: "Reports",
  settings: "Settings",

  // Companies
  company: "Company",
  company_list: "Company List",
  "company.description":
    "Manage company information including NIT, name, address, and phone number.",
  add_company: "Add Company",
  edit_company: "Edit Company",
  delete_company_confirmation: "Are you sure you want to delete this company?",
  company_created: "Company created successfully",
  company_updated: "Company updated successfully",
  company_deleted: "Company deleted successfully",
  company_name: "Company Name",
  company_created_success: "Company created successfully",
  company_updated_success: "Company updated successfully",
  company_deleted_success: "Company deleted successfully",
  error_creating_company: "Error creating company",
  error_updating_company: "Error updating company",
  error_deleting_company: "Error deleting company",
  error_loading_companies: "Error loading companies",
  confirm_delete_company: "Are you sure you want to delete this company?",
  nit: "NIT",
  name: "Name",
  address: "Address",
  phone: "Phone",

  // Products
  product: "Product",
  "product.description":
    "Create and manage products with multi-currency pricing and detailed characteristics.",
  product_list: "Product List",
  add_product: "Add Product",
  edit_product: "Edit Product",
  delete_product_confirmation: "Are you sure you want to delete this product?",
  product_created: "Product created successfully",
  product_updated: "Product updated successfully",
  product_deleted: "Product deleted successfully",
  code: "Code",
  characteristics: "Characteristics",
  prices: "Prices",
  add_price: "Add Price",
  remove_price: "Remove",
  price: "Price",
  currency: "Currency",
  filter_by_company: "Filter by Company",

  // Inventory
  inventory_management: "Inventory Management",
  quantity: "Quantity",
  "inventory.description":
    "Track inventory levels and generate PDF reports that can be emailed.",
  add_item: "Add Item",
  edit_inventory_item: "Edit Inventory Item",
  add_inventory_item: "Add Inventory Item",
  inventory_item_created: "Inventory item created successfully",
  inventory_item_updated: "Inventory item updated successfully",
  inventory_item_deleted: "Inventory item deleted successfully",
  error_creating_inventory_item: "Error creating inventory item",
  error_updating_inventory_item: "Error updating inventory item",
  error_deleting_inventory_item: "Error deleting inventory item",
  confirm_delete_inventory_item: "Are you sure you want to delete this item?",
  select_product: "Select a product",
  download_report: "Download Report",
  email_report: "Email Report",
  email_inventory_report: "Email Inventory Report",
  inventory_report_downloaded: "Report downloaded successfully",
  inventory_report_email_sent:
    "Inventory report will be sent to your email shortly",
  error_downloading_inventory_report: "Error downloading report",
  error_sending_inventory_report: "Error sending inventory report",
  report_filtered_for_company: "The report will be filtered for company:",
  send_email: "Send Email",
  please_enter_an_email_address: "Please enter an email address",

  // Reports
  generate_report: "Generate Report",
  send_report: "Send Report",
  report_generated: "Report generated successfully",
  report_sent: "Report sent successfully",

  // AI Assistant
  ai_assistant: "AI Product Assistant",
  "ai_assistant.description":
    "Our AI assistant can help you find the right products and companies based on your needs. Just ask a question!",
  ai_welcome_title: "Hello! How can I help you today?",
  ai_welcome_message:
    "I can recommend products and companies based on your requirements. Try asking me something or use one of the suggestions below.",
  ask_about_products: "Ask about products or companies...",
  recommended_products: "Recommended Products",
  recommended_companies: "Recommended Companies",
  match_score: "Match Score",
  no_recommendations_found:
    "I couldn't find any recommendations matching your query. Please try a different question.",

  // Errors
  error_creating: "Error creating {{item}}",
  error_updating: "Error updating {{item}}",
  error_deleting: "Error deleting {{item}}",
  error_loading: "Error loading {{item}}",
};

const esTranslation = {
  // Common
  app_title: "Gestion de inventario",
  loading: "Cargando...",
  error: "Error",
  save: "Guardar",
  cancel: "Cancelar",
  delete: "Eliminar",
  edit: "Editar",
  add: "Agregar",
  actions: "Acciones",
  filter: "Filtrar",
  search: "Buscar",
  confirmation: "Confirmación",
  yes: "Sí",
  no: "No",
  send: "Enviar",
  sending: "Enviando...",
  saving: "Guardando...",
  processing: "Procesando...",
  thinking: "Pensando...",
  welcome: "Bienvenido",
  welcome_description: "Bienvenido a la gestión de inventario",
  get_started: "Comenzar",

  login_title:
    "Por favor, inicia sesión para acceder a todas las funcionalidades",
  login_description:
    "Los usuarios externos pueden ver las empresas, mientras que los usuarios administradores tienen acceso completo a todas las funcionalidades.",
  login: "Iniciar sesión",

  // Auth
  logout: "Cerrar sesión",
  email: "Correo electrónico",
  password: "Contraseña",
  sign_in: "Ingresar",
  register: "Registrarse",
  create_account: "Crear Cuenta",
  welcome_back: "Bienvenido de Nuevo",
  login_successful: "Inicio de sesión exitoso",
  login_failed: "Error al iniciar sesión",
  registration_successful: "Registro exitoso",
  registration_failed: "Error al registrarse",
  email_password_required: "El correo y la contraseña son requeridos",
  invalid_credentials: "Correo o contraseña inválidos",

  // Navigation
  dashboard: "Panel principal",
  companies: "Empresas",
  products: "Productos",
  inventory: "Inventario",
  reports: "Reportes",
  settings: "Configuración",

  // Companies
  company: "Empresa",
  company_list: "Lista de Empresas",
  "company.description": "Manejar información de empresas",
  add_company: "Agregar Empresa",
  edit_company: "Editar Empresa",
  delete_company_confirmation: "¿Está seguro que desea eliminar esta empresa?",
  company_created: "Empresa creada exitosamente",
  company_updated: "Empresa actualizada exitosamente",
  company_deleted: "Empresa eliminada exitosamente",
  company_name: "Nombre de la Empresa",
  company_created_success: "Empresa creada exitosamente",
  company_updated_success: "Empresa actualizada exitosamente",
  company_deleted_success: "Empresa eliminada exitosamente",
  error_creating_company: "Error al crear empresa",
  error_updating_company: "Error al actualizar empresa",
  error_deleting_company: "Error al eliminar empresa",
  error_loading_companies: "Error al cargar empresas",
  confirm_delete_company: "¿Está seguro que desea eliminar esta empresa?",
  nit: "NIT",
  name: "Nombre",
  address: "Dirección",
  phone: "Teléfono",

  // Products
  product: "Producto",
  product_list: "Lista de Productos",
  "product.description": "Manejar información de productos",
  add_product: "Agregar Producto",
  edit_product: "Editar Producto",
  delete_product_confirmation: "¿Está seguro que desea eliminar este producto?",
  product_created: "Producto creado exitosamente",
  product_updated: "Producto actualizado exitosamente",
  product_deleted: "Producto eliminado exitosamente",
  code: "Código",
  characteristics: "Características",
  prices: "Precios",
  add_price: "Agregar Precio",
  remove_price: "Eliminar",
  price: "Precio",
  currency: "Moneda",
  filter_by_company: "Filtrar por Empresa",

  // Inventory
  inventory_management: "Gestión de Inventario",
  quantity: "Cantidad",
  "inventory.description": "Manejar información de inventario",
  add_item: "Agregar Artículo",
  edit_inventory_item: "Editar Artículo de Inventario",
  add_inventory_item: "Agregar Artículo de Inventario",
  inventory_item_created: "Artículo de inventario creado exitosamente",
  inventory_item_updated: "Artículo de inventario actualizado exitosamente",
  inventory_item_deleted: "Artículo de inventario eliminado exitosamente",
  error_creating_inventory_item: "Error al crear artículo de inventario",
  error_updating_inventory_item: "Error al actualizar artículo de inventario",
  error_deleting_inventory_item: "Error al eliminar artículo de inventario",
  confirm_delete_inventory_item:
    "¿Está seguro que desea eliminar este artículo?",
  select_product: "Seleccionar un producto",
  download_report: "Descargar Reporte",
  email_report: "Enviar Reporte por Email",
  email_inventory_report: "Enviar Reporte de Inventario por Email",
  inventory_report_downloaded: "Reporte descargado exitosamente",
  inventory_report_email_sent:
    "El reporte de inventario será enviado a su correo en breve",
  error_downloading_inventory_report: "Error al descargar reporte",
  error_sending_inventory_report: "Error al enviar reporte de inventario",
  report_filtered_for_company: "El reporte será filtrado para la empresa:",
  send_email: "Enviar Email",
  please_enter_an_email_address:
    "Por favor, ingrese una dirección de correo electrónico",

  // Reports
  generate_report: "Generar Reporte",
  send_report: "Enviar Reporte",
  report_generated: "Reporte generado exitosamente",
  report_sent: "Reporte enviado exitosamente",

  // AI Assistant
  ai_assistant: "Asistente de Productos IA",
  "ai_assistant.description":
    "Nuestro asistente de IA puede ayudarte a encontrar los productos y empresas adecuados según tus necesidades. ¡Solo haz una pregunta!",
  ai_welcome_title: "¡Hola! ¿Cómo puedo ayudarte hoy?",
  ai_welcome_message:
    "Puedo recomendar productos y empresas según tus requisitos. Intenta preguntarme algo o usa una de las sugerencias a continuación.",
  ask_about_products: "Pregunta sobre productos o empresas...",
  recommended_products: "Productos Recomendados",
  recommended_companies: "Empresas Recomendadas",
  match_score: "Puntuación de Coincidencia",
  no_recommendations_found:
    "No pude encontrar recomendaciones que coincidan con tu consulta. Por favor, intenta con una pregunta diferente.",

  // Errors
  error_creating: "Error al crear {{item}}",
  error_updating: "Error al actualizar {{item}}",
  error_deleting: "Error al eliminar {{item}}",
  error_loading: "Error al cargar {{item}}",
};

// Initialize i18next
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslation,
    },
    es: {
      translation: esTranslation,
    },
  },
  lng: initialLanguage, // Use saved language from cookie or default to English
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // React already escapes values
  },
});

export default i18n;
