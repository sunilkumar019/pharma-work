//import use cases
const getEmployee = require("../usecases/employee/getEmployee")
const addEmployee = require("../usecases/employee/addEmployee")

const updateEmployee = require("../usecases/employee/updateEmployee")
const deleteEmployee = require("../usecases/employee/deleteEmployee")


//get Employee
exports.getEmployee = async()=>{
    let EmployeeNames = await getEmployee();
    if (EmployeeNames !== null) {
        EmployeeNames = EmployeeNames.map(it => {
        
            return {
                id:it._id,
                name: it.name
                }
            })
    }
    return EmployeeNames;
}

//Add Employee
exports.addEmployee = async (employee)=>{
    if (!employee.name) throw new Error('employee Name is Required');
    if(!employee.email) employee.email = null;
    if(!employee.phone) employee.phone = null;
    if(!employee.address) employee.address = null;
    let newemployee = {
        name: employee.name,
        email : employee.email,
        address: employee.address,
        phone : employee.phone
    }

    let savedemployee = await addEmployee(newemployee);
    return savedemployee;
}

//update Employee
exports.updateEmployee = async(employeeprops)=>{
    let employeeId = employeeprops.id;
    if(!employeeprops.id) throw new Error("Please provide employee Id");
    let filter = {}
    if(!employeeprops.name) throw new Error("Please provide employee Name");
    filter.name = employeeprops.name;

    if(employeeprops.email) filter.email = employeeprops.email;
    if(employeeprops.address) filter.address = employeeprops.address;
    if(employeeprops.phone) filter.phone = employeeprops.phone;


    await updateEmployee(employeeId,filter);

    let res = await getEmployee()

     return res;
}
//delete division
exports.deleteEmployee = async(employeeId)=>{
    if(!employeeId) throw new Error("Please provide employee Id");

    let employeeResponse = await deleteEmployee(employeeId);
    return employeeResponse;
}
