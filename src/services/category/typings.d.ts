declare namespace REQUEST {
  type GetCategory = {
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
    parentId: string;
    isDeleted: boolean;
    createdAt: string
  };

  type ResponseDataCategory = {
    result: Category[];
    count: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
  };
}
