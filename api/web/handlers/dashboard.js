const repVisit = require("../../../core/models/repVisit");


const dataHanlder = async (dayOrMonth) => {
    const now = new Date();
    const dateHanlder = new Date();

    if(dayOrMonth === 7) {
        dateHanlder.setDate(now.getDate() - dayOrMonth);
    }else{
        dateHanlder.setMonth(now.getMonth() - dayOrMonth);
    }
    const date = dateHanlder.toJSON().split("T")[0];
    return await visitsHanlder(date, now.toJSON().split('T')[0]);
}

const visitsHanlder = async (date, now) => {
    return await repVisit.aggregate([
        {
            $project: {
                date: {$dateToString: {format: "%Y-%m-%d", date: "$time"}},
            },
        },
        {
            $match: {
                $and: [{date: {$gte: date}}, {date: {$lte: now}}]
            },
        },
        {
            $count: "visits"
        }
    ]);
};

const getAllVisits = async (req, res, send) => {
  const lastWeek = await dataHanlder(7);
  const lastMonth = await dataHanlder(1);
  const lastThreeMonths = await dataHanlder(3);

  res.send({lastWeek, lastMonth, lastThreeMonths})
};

module.exports = {
  getAllVisits,
};
