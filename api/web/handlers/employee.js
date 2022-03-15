const employeeController = require("../../../core/controllers/employee")
const addEmployee =async (req, res, next)=>{
    
    try {
        let employee = await employeeController.addEmployee(req.body)
        req.data = employee
        next()
    }
    catch (e) {
        req.status = 409;
        next(e)
    }
}

const getEmployee = async(req,res,next)=>{
    try {
        let employees = await employeeController.getEmployee(req.body)
        req.data = employees
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}

const updateEmployee = async(req,res,next)=>{
    try {
        let employeeRecords = await employeeController.updateEmployee(req.body)
        req.data = employeeRecords
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}

const deleteEmployee = async(req,res,next)=>{
    try {
        let employeeRes = await employeeController.deleteEmployee(req.params.Id)
        if(employeeRes.Error){
            req.status = 400;
            throw new Error(employeeRes.Error)
        }
        else{
            req.message = employeeRes.Message;
            req.data = null;
            next()
        }
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}


module.exports = {addEmployee, getEmployee, updateEmployee, deleteEmployee}