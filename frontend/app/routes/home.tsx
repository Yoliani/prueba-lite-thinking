import { Welcome } from "../welcome/welcome";
import type { MetaArgs } from "react-router";

export function meta({}: MetaArgs) {
  return [
    { title: "Gestión de inventario - Lite Thinking" },
    { name: "description", content: "Una solución completa para gestionar empresas, productos e inventario" },
  ];
}

export default function Home() {
  return <Welcome />;
}
