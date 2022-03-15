var schedule = require('node-schedule');
const reps = require("../core/controllers/rep");
const customers = require("../core/controllers/customer");
const franchisee = require("../core/controllers/franchisee");
const sendEmail = require("../core/usecases/Email");
const getAdmin = require("../core/usecases/admin/getAdmin");
let sendNotification = require("../firebase_notification");
//import moment for date formatting
const moment = require("moment");

module.exports = (async() => {
    schedule.scheduleJob('01 03 08 * * *', async() => {
        try {

            let daysBeforeBirthday = process.env.BIRTHDAY_NOTIFICATION_BEFORE_DAYS ? Number(process.env.BIRTHDAY_NOTIFICATION_BEFORE_DAYS) : 2;

            let allCustomers = await customers.getCustomer({});
            let allDistributors = await reps.getRep({ is_owner: true });
            let allMrs = await reps.getRep({});
            // let franchiseeData = await franchisee.getFranchisee({id: })

            /////////////////customers///////////////////
            let upcomingCustomerBirthdays = [];
            let customerBirthdays = [];
            for (let i = 0; i < allCustomers.length; i++) {
                if (allCustomers[i].dob != null) {
                    if (dateDifference(allCustomers[i].dob) <= daysBeforeBirthday) {
                        let Franchisee = await franchisee.getFranchisee({ id: allCustomers[i].franchisee_id })
                        let DistributorsData = await reps.getRep({ is_owner: true, franchisee_id: allCustomers[i].franchisee_id });
                        let customer = {
                            name: allCustomers[i].name,
                            email: allCustomers[i].email,
                            phone: allCustomers[i].phone,
                            city: allCustomers[i].city,
                            state: allCustomers[i].state,
                            address: allCustomers[i].address,
                            profession: allCustomers[i].profession,
                            dob: allCustomers[i].dob,
                            franchisee_name: Franchisee.name,
                            franchisee_email: Franchisee.email
                        }
                        if (dateDifference(allCustomers[i].dob) == daysBeforeBirthday) {
                            upcomingCustomerBirthdays.push(customer);

                            let title = "Customer Birthday on " + allCustomers[i].dob;
                            let message = " Name: " + customer.name + " Phone:" + customer.phone + " Address:" + customer.address + " " + customer.city + " " + customer.state + " ";
                            for (let i = 0; i < DistributorsData.length; i++) {
                                if (DistributorsData[i].device_token != null) {
                                    if (process.env.NOTIFICATION_STATUS) {
                                        let notificationResponse = await sendNotification({ title: title, message: message }, DistributorsData[i].device_token);
                                    }
                                }
                            }

                        } else if (dateDifference(allCustomers[i].dob) == 0) {
                            customerBirthdays.push(customer);

                            let title = "Customer Birthday Today";
                            let message = " Name: " + customer.name + " Phone:" + customer.phone + " Address:" + customer.address + " " + customer.city + " " + customer.state + " ";
                            for (let i = 0; i < DistributorsData.length; i++) {
                                if (DistributorsData[i].device_token != null) {
                                    if (process.env.NOTIFICATION_STATUS) {
                                        let notificationResponse = await sendNotification({ title: title, message: message }, DistributorsData[i].device_token);
                                    }
                                }
                            }
                        }
                    }
                }
            }

            let customer2CompanyEmailSubject = "After "+daysBeforeBirthday+" Days Customers Birthday's Notification";
            let customer2CompanyEmail = `<h3>Customers Details</h3>`;
            upcomingCustomerBirthdays.forEach(it => {
                customer2CompanyEmail = customer2CompanyEmail + `<hr/>
                <div>Name: ${it.name}</div>
                <div>Email: ${it.email}</div>
                <div>Phone: ${it.phone}</div>
                <div>Profession: ${it.profession}</div>
                <div>DOB: ${it.dob}</div>
                <div>Franchisee: ${it.franchisee_name}</div>
                <div>Address : ${it.address} ${it.city} ${it.state}</div>
                <hr/>`;
            });

            let customerCompanyEmailSubject = " Today Customers Birthday's Notification";
            let customerCompanyEmail = `<h3>Customers Details</h3>`;
            customerBirthdays.forEach(it => {
                customerCompanyEmail = customerCompanyEmail + `<hr/>
                <div>Name: ${it.name}</div>
                <div>Email: ${it.email}</div>
                <div>Phone: ${it.phone}</div>
                <div>Profession: ${it.profession}</div>
                <div>DOB: ${it.dob}</div>
                <div>Franchisee: ${it.franchisee_name}</div>
                <div>Address : ${it.address} ${it.city} ${it.state}</div>
                <hr/>`;
            });
            /////////////////customers///////////////////

            ///////////distributor//////////////////
            let upcomingDistributorBirthdays = [];
            let distributorBirthdays = [];
            for (let i = 0; i < allDistributors.length; i++) {
                if (allDistributors[i].dob != "NA") {
                    if (dateDifference(allDistributors[i].dob) <= daysBeforeBirthday) {
                        let Franchisee = await franchisee.getFranchisee({ id: allDistributors[i].franchisee_id })
                        let distributor = {
                            name: allDistributors[i].name,
                            email: allDistributors[i].email,
                            phone: allDistributors[i].phone,
                            city: allDistributors[i].city,
                            state: allDistributors[i].state,
                            address: allDistributors[i].address,
                            dob: allDistributors[i].dob,
                            op_area: allDistributors[i].op_area,
                            franchisee_name: Franchisee.name,
                            franchisee_email: Franchisee.email,
                            device_token: allDistributors[i].device_token,
                        }

                        if (dateDifference(allDistributors[i].dob) == daysBeforeBirthday) {
                            upcomingDistributorBirthdays.push(distributor);
                        } else if (dateDifference(allDistributors[i].dob) == 0) {
                            distributorBirthdays.push(distributor);
                            if (distributor.device_token != null) {
                                if (process.env.NOTIFICATION_STATUS) {
                                    let message = "Many many returns of the day from Company's Side!";
                                    let notificationResponse = await sendNotification({ title: "Happy Birthday", message: message }, distributor.device_token);
                                }
                            }
                        }
                    }
                }
            }

            let distributor2CompanyEmailSubject = "After "+daysBeforeBirthday+" Days Distributors Birthday's Notification";
            let distributor2CompanyEmail = `<h3>Distributors Details</h3>`;
            upcomingDistributorBirthdays.forEach(it => {
                distributor2CompanyEmail = distributor2CompanyEmail + `<hr/>
                <div>Name: ${it.name}</div>
                <div>Email: ${it.email}</div>
                <div>Phone: ${it.phone}</div>
                <div>DOB: ${it.dob}</div>
                <div>Franchisee: ${it.franchisee_name}</div>
                <div>Address : ${it.address} ${it.city} ${it.state}</div>
                <hr/>`;
            });

            let distributorCompanyEmailSubject = "Today Distributors Birthday's Notification";
            let distributorCompanyEmail = `<h3>Distributors Details</h3>`;
            distributorBirthdays.forEach(it => {
                distributorCompanyEmail = distributorCompanyEmail + `<hr/>
                <div>Name: ${it.name}</div>
                <div>Email: ${it.email}</div>
                <div>Phone: ${it.phone}</div>
                <div>DOB: ${it.dob}</div>
                <div>Franchisee: ${it.franchisee_name}</div>
                <div>Address : ${it.address} ${it.city} ${it.state}</div>
                <hr/>`;
            });
            ///////////distributor//////////////////

            ////////////MR///////////////////
            let upcomingMrBirthdays = [];
            let mrBirthdays = [];
            let mr2Notification = "";
            let mrNotification = "";

            for (let i = 0; i < allMrs.length; i++) {
                if (allMrs[i].dob != "NA") {
                    if (dateDifference(allMrs[i].dob) <= daysBeforeBirthday) {
                        let Franchisee = await franchisee.getFranchisee({ id: allMrs[i].franchisee_id });
                        let DistributorsData = await reps.getRep({ is_owner: true, franchisee_id: allMrs[i].franchisee_id });
                        let mr = {
                            name: allMrs[i].name,
                            email: allMrs[i].email,
                            phone: allMrs[i].phone,
                            city: allMrs[i].city,
                            state: allMrs[i].state,
                            address: allMrs[i].address,
                            dob: allMrs[i].dob,
                            op_area: allMrs[i].op_area,
                            franchisee_name: Franchisee.name,
                            franchisee_email: Franchisee.email,
                            device_token: allMrs[i].device_token,
                        }

                        if (dateDifference(allMrs[i].dob) == daysBeforeBirthday) {
                            upcomingMrBirthdays.push(mr);

                            let title = "Medical Representative Birthday on " + allMrs[i].dob;
                            let message = " Name: " + mr.name + " Phone:" + mr.phone + " Address:" + mr.address + " " + mr.city + " " + mr.state + " ";
                            for (let i = 0; i < DistributorsData.length; i++) {
                                if (DistributorsData[i].device_token != null) {
                                    if (process.env.NOTIFICATION_STATUS) {
                                        let notificationResponse = await sendNotification({ title: title, message: message }, DistributorsData[i].device_token);
                                    }
                                }
                            }

                        } else if (dateDifference(allMrs[i].dob) == 0) {
                            mrBirthdays.push(mr);


                            let title = "Medical Representative Birthday Today";
                            let message = " Name: " + mr.name + " Phone:" + mr.phone + " Address:" + mr.address + " " + mr.city + " " + mr.state + " ";
                            for (let i = 0; i < DistributorsData.length; i++) {
                                if (DistributorsData[i].device_token != null) {
                                    if (process.env.NOTIFICATION_STATUS) {
                                        let notificationResponse = await sendNotification({ title: title, message: message }, DistributorsData[i].device_token);
                                    }
                                }
                            }

                            if (mr.device_token != null) {
                                if (process.env.NOTIFICATION_STATUS) {
                                    let message = "Many many returns of the day from Company's Side!";
                                    let notificationResponse = await sendNotification({ title: "Happy Birthday", message: message }, mr.device_token)
                                }
                            }
                        }
                    }
                }
            }

            let mr2CompanyEmailSubject = "After "+daysBeforeBirthday+" Days Distributors Birthday's on Notification";
            let mr2CompanyEmail = `<h3>Distributors Details</h3>`;
            upcomingMrBirthdays.forEach(it => {
                mr2CompanyEmail = mr2CompanyEmail + `<hr/>
                <div>Name: ${it.name}</div>
                <div>Email: ${it.email}</div>
                <div>Phone: ${it.phone}</div>
                <div>DOB: ${it.dob}</div>
                <div>Franchisee: ${it.franchisee_name}</div>
                <div>Address : ${it.address} ${it.city} ${it.state}</div>
                <hr/>`;
            });

            let mrCompanyEmailSubject = "Today Distributors Birthday's on Notification";
            let mrCompanyEmail = `<h3>Distributors Details</h3>`;
            mrBirthdays.forEach(it => {
                mrCompanyEmail = mrCompanyEmail + `<hr/>
                <div>Name: ${it.name}</div>
                <div>Email: ${it.email}</div>
                <div>Phone: ${it.phone}</div>
                <div>DOB: ${it.dob}</div>
                <div>Franchisee: ${it.franchisee_name}</div>
                <div>Address : ${it.address} ${it.city} ${it.state}</div>
                <hr/>`;
            });
            ////////////MR///////////////////


            let adminRecord = await getAdmin();
            delete adminRecord.password_hash;
            if (upcomingCustomerBirthdays.length > 0)
                await sendEmail({
                    To: adminRecord.email,
                    Subject: customer2CompanyEmailSubject,
                    Body: customer2CompanyEmail
                })
            if (customerBirthdays.length > 0)
                await sendEmail({
                    To: adminRecord.email,
                    Subject: customerCompanyEmailSubject,
                    Body: customerCompanyEmail
                })
            if (upcomingDistributorBirthdays.length > 0)
                await sendEmail({
                    To: adminRecord.email,
                    Subject: distributor2CompanyEmailSubject,
                    Body: distributor2CompanyEmail
                })
            if (distributorBirthdays.length > 0)
                await sendEmail({
                    To: adminRecord.email,
                    Subject: distributorCompanyEmailSubject,
                    Body: distributorCompanyEmail
                })
            if (upcomingMrBirthdays.length > 0)
                await sendEmail({
                    To: adminRecord.email,
                    Subject: mr2CompanyEmailSubject,
                    Body: mr2CompanyEmail
                })
            if (mrBirthdays.length > 0)
                await sendEmail({
                    To: adminRecord.email,
                    Subject: mrCompanyEmailSubject,
                    Body: mrCompanyEmail
                })

            console.log("daily Birthdays notification mail sent at " + moment(new Date(Date.now())).format("LLL"))

        } catch (e) {
            console.log("************Error while sending Birthday Notification**********", e)
        }
    });

})()

function dateDifference(date) {
    var date2 = new Date(date);
    var birthdayDate = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate(), 12);
    var now = new Date();

    var days = 0;

    Math.floor(days = ((birthdayDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));


    if (days < 0) {
        var yearDiff = birthdayDate.getYear() - now.getYear();
        yearDiff *= -1;

        var monthDiff = birthdayDate.getMonth() - now.getMonth();
        var daysDiff = birthdayDate.getDay() - now.getDay();

        if (monthDiff <= 0) {
            if (daysDiff > 0) {} else {
                days += 365;
            }
        }
        var extraDays = yearDiff / 4;
        days = days + (yearDiff * 365) + extraDays;
    } else {
        throw new FutureDateException();
    }


    days = Math.floor(Math.round(days));

    if (days === 365) {
        days = 0;
    }

    if (days === 366) {
        days = 1;
    }
    return days + 1;

}