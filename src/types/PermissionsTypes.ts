//constantes para verificar los permisos de los usuarios en la base de datos

export enum Method {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH" // Agregar PATCH
}

export enum Scope {
  Read = "read",
  Write = "write",
  Update = "update",
  Delete = "delete",
  SoftDelete = "soft-delete" // Agregar un nuevo scope si es necesario
}

export const permissions = [
  {
    method: Method.GET,
    scope: Scope.Read,
    permissions: ["admin_granted"]
  },
  {
    method: Method.POST,
    scope: Scope.Write,
    permissions: ["admin_granted"]
  },
  {
    method: Method.PUT,
    scope: Scope.Update,
    permissions: ["admin_granted"]
  },
  {
    method: Method.DELETE,
    scope: Scope.Delete,
    permissions: ["admin_granted"]
  },
  {
    method: Method.PATCH,
    scope: Scope.SoftDelete, // Definir un scope específico para soft-delete si es necesario
    permissions: ["admin_granted"]
  }
];
