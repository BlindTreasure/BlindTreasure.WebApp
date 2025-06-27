declare namespace REQUEST {
  type GetCategory = {
    search?: string;
    pageIndex?: number;
    pageSize?: number;
  };

  type CategoryForm = {
    id?: string;
    name: string;
    description: string;
    parentId?: string;
    imageUrl?: File;
  };
}

declare namespace API {
  type Category = {
    id: string;
    name: string;
    description: string;
    parentId?: string;
    isDeleted: boolean;
    createdAt: string ;
    imageUrl?: string;
    children?: Category[];
  };

  type ResponseDataCategory = {
    result: Category[];
    count: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
  };

  type ShowCategory = {
    id: string;
    name: string;

  }
}
