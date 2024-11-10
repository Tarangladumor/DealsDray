import { Dispatch } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { NavigateFunction } from "react-router-dom";
import { setLoading } from "../../slices/adminSlice";
import { apiconnector } from "../apiconnector";
import { employeepoints } from "../apis";
import { AxiosResponse } from "axios";

const { ADD_EMPLOYEE_API, GET_ALL_EMPLOYEE,GET_EMPLOYEE_BY_ID , EDIT_EMPLOYEE, DELETE_EMPLOYEE} = employeepoints;

interface EmployeeData {
    name: string;
    email: string;
    mobileNo: string;
    designation: 'HR' | 'Manager' | 'Sales';
    gender: 'Male' | 'Female';
    course: ('MCA' | 'BCA' | 'BSC')[];
    image: File;
}

interface AddEmployeeResponse {
    success: boolean;
    message?: string;
    data?: EmployeeData;
}

export function addEmployee(employeeData: EmployeeData, navigate: NavigateFunction, token:string | null) {
    return async (dispatch: Dispatch) => {
        const toastId = toast.loading("Adding Employee...");
        dispatch(setLoading(true));

        try {
            const formData = new FormData();
            formData.append("name", employeeData.name);
            formData.append("email", employeeData.email);
            formData.append("mobileNo", employeeData.mobileNo);
            formData.append("designation", employeeData.designation);   
            formData.append("gender", employeeData.gender);
            formData.append("course", JSON.stringify(employeeData.course));
            formData.append("employeeImage", employeeData.image);

            const response = await apiconnector('POST', ADD_EMPLOYEE_API, formData, {
                "Content-Type": "multipart/form-data",
                Authorization:`Bearer ${token}`
            }) as AxiosResponse<AddEmployeeResponse>;

            const { data } = response;
            if (!data.success) {
                toast.error(response?.data?.message as string)
                throw new Error(data.message || "Employee creation failed");
            }

            toast.success("Employee added successfully!");
            navigate('/employee-list');
        } catch (error) {
            console.error("ADD EMPLOYEE API ERROR:", error);
            toast.error(error instanceof Error ? error.message : "Failed to add employee");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    };
}

export async function getAllEmployee(token: string | null) {
    const toastId = toast.loading('Loading...');

    let result = [];
    try {
        const response = await apiconnector('GET', GET_ALL_EMPLOYEE,undefined, {
            Authorization: `Bearer ${token}`,
        });

        if (!response?.data?.success) {
            toast.error(response?.data?.message)
            throw new Error('Could not fetch employee data');
        }

        result = response?.data?.data;

    } catch (error) {
        console.log('GET_ALL_EMPLOYEE API ERROR...', error);
        toast.error('Failed to load employee data');
    }

    toast.dismiss(toastId);

    return result;
}

export async function getEmployeeById(employeeId: string, token: string | null) {
    const toastId = toast.loading('Loading employee details...');

    let result = null;
    try {
        const response = await apiconnector('GET', `${GET_EMPLOYEE_BY_ID.replace(':id', employeeId)}`, undefined, {
            Authorization: `Bearer ${token}`,
        });

        if (!response?.data?.success) {
            toast.error(response?.data?.message)
            throw new Error('Could not fetch employee data');
        }

        result = response?.data?.data;

    } catch (error) {
        console.log('GET_EMPLOYEE_BY_ID API ERROR...', error);
        toast.error('Failed to load employee data');
    }

    toast.dismiss(toastId);

    return result;
}

export interface Employee {
    id: string;
    name: string;
    email: string;
    mobileNo: string;
    designation: "HR" | "Manager" | "Sales" | ""; // Include possible designations or leave as empty string for flexibility
    gender: "Male" | "Female" | "Other";
    course: string[]; // Array to accommodate multiple courses
    image: string | File; // Image URL string
    createdDate: string; // Date in ISO string format or use `Date` if needed
  }

  export async function editEmployee(formData: FormData, token: string | null, employeeId: string) {
    const toastId = toast.loading('Updating employee...');
    let result = null;

    console.log("HIIII",employeeId);

    try {
        // Ensure token exists before making the request
        if (!token) {
            throw new Error('Authentication token is missing');
        }

        // Send the employee id in the URL (for RESTful routes, the id is usually passed in the URL)
        const response = await apiconnector('POST', `${EDIT_EMPLOYEE.replace(':id', employeeId)}`, formData, {
            Authorization: `Bearer ${token}`,
        });

        // Validate the response before using the data
        if (response?.data?.success) {
            result = response?.data?.data;
            toast.success('Employee updated successfully');
        } else {
            toast.error(response?.data?.message)
            throw new Error('Failed to update employee data');
        }

    } catch (error) {
        console.error('EDIT_EMPLOYEE API ERROR...', error);
        toast.error(error instanceof Error ? error.message : 'Failed to update employee');
    }

    toast.dismiss(toastId);

    return result;
}

export async function deleteEmployee(employeeId: string, token: string | null) {
    const toastId = toast.loading('Deleting employee...');
    let result = null;
  
    try {
      if (!token) {
        throw new Error('Authentication token is missing');
      }
  
      const response = await apiconnector('DELETE', `${DELETE_EMPLOYEE.replace(':id', employeeId)}`, undefined, {
        Authorization: `Bearer ${token}`,
      });
  
      if (response?.data?.success) {
        result = response?.data?.data;
        toast.success('Employee deleted successfully');
      } else {
        toast.error(response?.data?.message)
        throw new Error('Failed to delete employee');
      }
  
    } catch (error) {
      console.error('DELETE_EMPLOYEE API ERROR...', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete employee');
    }
  
    toast.dismiss(toastId);
  
    return result;
  }