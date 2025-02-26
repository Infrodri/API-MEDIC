//constantes para verificar los permisos de los usuarios en la base de datos

export enum Method {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
  }
  //alcance de la aplicacion 
  export enum Scope {
    Read = "read",
    Write = "write",
    Update = "update",
    Delete = "delete"
  }
  
  //permisos de los usuarios en la base de datos
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
    }
  ];