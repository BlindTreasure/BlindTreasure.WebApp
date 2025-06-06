declare namespace REQUEST{
    type GetUsers = {
        search?: string;
        status?: string;
        roleName?: string;
        sortBy?: string;
        desc?: boolean;
        pageIndex?: number;
        pageSize?: number;
    }

    type ChangeStatusUsers = {
        status: string;
        reason?: string;
    }
}

declare namespace API{
    type User = {
        userId: string;
        fullName: string;
        email: string;
        dateOfBirth: string;
        status: string;
        phoneNumber: string;
        roleName: string;
        createAt: string;
    }

    type ResponseDataUser = {
    result: User[];
    count: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
  };
}