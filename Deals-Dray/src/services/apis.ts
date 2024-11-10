const BASE_URL: string = "http://localhost:4000/api/v1/";

export const endpoints: Record<string, string> = {
    LOGIN_API: `${BASE_URL}/login`,
};

export const employeepoints : Record<string, string> = {
    ADD_EMPLOYEE_API: `${BASE_URL}/createEmployee`,
    GET_ALL_EMPLOYEE : `${BASE_URL}/getAllEmployee`,
    GET_EMPLOYEE_BY_ID : `${BASE_URL}/getemployeeById/:id`,
    EDIT_EMPLOYEE : `${BASE_URL}/editEmployee/:id`,
    DELETE_EMPLOYEE :  `${BASE_URL}/deleteEmployee/:id`
}
