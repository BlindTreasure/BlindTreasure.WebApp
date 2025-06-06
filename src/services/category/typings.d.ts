declare namespace REQUEST {
  type GetCategory = {
    pageIndex?: number;
    pageSize?: number;
  };

  type CategoryInfo = {
    id?: string;
    name: string;
    description: string;
    parentId?: string;
  }
}

declare namespace API {
  type Category = {
    id: string;
    name: string;
    description: string;
    parentId: string;
    isDeleted: boolean;
    createdAt: string ;
    children: Category[];
  };

  type ResponseDataCategory = {
    result: Category[];
    count: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
  };
}
