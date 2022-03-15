const franchisee = require("../../../core/models/franchisee");
const reps = require("../../../core/models/rep");
const repsVisits = require("../../../core/models/repVisit");
var ObjectId = require("mongodb").ObjectID;

const getCustomVisits = async (req, res, next) => {
  const { startDate, endDate, select, mrSelectedId, selectedDistributorId } = req.body;
  let data = [];
  let condition = {};

  if (select == "mr" ) {
    data = await customNameFetchHanlder({
      startDate,
      endDate,
      select,
      mrSelectedId,
    });
    res.send({ data: data });
  }

  if (select == "distributor") {
    data = await customNameFetchHanlder({
      startDate,
      endDate,
      select,
      selectedDistributorId
    });

    res.send({ data: data });
  }

  // When both are not provided
  if (!startDate && !endDate) {
    const before = new Date();
    before.setDate(new Date().getDate() - 120)
    const date = before.toISOString().split('T')[0];
    data = await mrAndDistributorHanlder({ $match: { date: date } });
  }

  // When both startDate and endDate are provided
  if (startDate && endDate) {
    condition = {
      $match: {
        $and: [{ date: { $gte: startDate } }, { date: { $lte: endDate } }],
      },
    };
    data = await mrAndDistributorHanlder(condition);
  }

  // When startDate is provided
  if (startDate && !endDate) {
    condition = {
      $match: { date: { $gte: startDate } },
    };
    data = await mrAndDistributorHanlder(condition);
  }

  // When endDate is provided
  if (endDate && !startDate) {
    condition = {
      $match: { date: { $lte: endDate } },
    };
    data = await mrAndDistributorHanlder(condition);
  }

  res.send({ data: data });
};

const getByName = async (req, res, next) => {
  const { name } = req.query;
  console.log(name.key)
  let data = await franchisee.find(
          { name: { $regex: `${name}`, $options: "i" } },
          { name: 1, email: 1, _id: 1 }
        );
  res.send(data);
};

const customNameFetchHanlder = async ({
  startDate,
  endDate,
  select,
  mrSelectedId,
  selectedDistributorId
}) => {
  console.log(mrSelectedId, selectedDistributorId)
  let condition = {};
  if (select == "mr") {
    if (!startDate && !endDate) {
      condition = {
        $match: { rep_id: ObjectId(mrSelectedId) },
      };
      return await mrAndDistributorHanlder(condition);
    }

    if (startDate && endDate) {
      condition = {
        $match: {
          $and: [
            { rep_id: ObjectId(mrSelectedId) },
            { date: { $gte: startDate } },
            { date: { $lte: endDate } },
          ],
        },
      };
      return await mrAndDistributorHanlder(condition);
    }

    if (startDate && !endDate) {
      condition = {
        $match: {
          $and: [
            { rep_id: ObjectId(mrSelectedId) },
            { date: { $gte: startDate } },
          ],
        },
      };
      return await mrAndDistributorHanlder(condition);
    }

    if (!startDate && endDate) {
      condition = {
        $match: {
          $and: [
            { rep_id: ObjectId(mrSelectedId) },
            { date: { $lte: endDate } },
          ],
        },
      };
      return await mrAndDistributorHanlder(condition);
    }
  }

  if (select == "distributor") {
    if (!startDate && !endDate) {
      condition = {
        $match: { franchisee_id: ObjectId(selectedDistributorId) },
      };
      console.log("-----------------------------------------------------------")
      return await mrAndDistributorHanlder(condition);
    }

    if (startDate && endDate) {
      condition = {
        $match: {
          $and: [
            { franchisee_id: ObjectId(selectedDistributorId) },
            { date: { $gte: startDate } },
            { date: { $lte: endDate } },
          ],
        },
      };
      return await mrAndDistributorHanlder(condition);
    }

    if (startDate && !endDate) {
      condition = {
        $match: {
          $and: [
            { franchisee_id: ObjectId(selectedDistributorId) },
            { date: { $gte: startDate } },
          ],
        },
      };
      return await mrAndDistributorHanlder(condition);
    }

    if (!startDate && endDate) {
      condition = {
        $match: {
          $and: [
            { franchisee_id: ObjectId(selectedDistributorId) },
            { date: { $lte: endDate } },
          ],
        },
      };
      return await mrAndDistributorHanlder(condition);
    }
  }
};

const mrAndDistributorHanlder = async (condition) => {
  return await repsVisits.aggregate([
    {
      $project: {
        date: { $dateToString: { format: "%Y-%m-%d", date: "$time" } },
        rep_id: 1,
        franchisee_id: 1,
        customer_id: 1,
      },
    },
    condition,
    {
      $group: {
        _id: "$date",
        detail: { $first: "$$ROOT" },
        visits: { $sum: 1 },
      },
    },
    {
      $replaceRoot: {
        newRoot: { $mergeObjects: [{ visits: "$visits" }, "$detail"] },
      },
    },
    {
      $sort: { _id: -1 },
    },
  ]);
};

const downloadDetails = async (req, res, next) => {
  const { franchisee_id, date } = req.body;

  const data = await repsVisits.aggregate([
    {
      $match: { franchisee_id: ObjectId(franchisee_id) },
    },
    {
      $project: {
        latitude: 1,
        longitude: 1,
        place: 1,
        rep_id: 1,
        customer_id: 1,
        franchisee_id: 1,
        date: { $dateToString: { format: "%Y-%m-%d", date: "$time" } },
      },
    },
    {
      $match: { date: date },
    },
    {
      $lookup: {
        from: "reps",
        localField: "rep_id",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              _id: 0,
              name: 1,
            },
          }
        ],
        as: "mrName",
      },
    },
    {
      $lookup: {
        from: "franchisees",
        localField: "franchisee_id",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              name: 1,
              _id: 0
            },
          },
        ],
        as: "distributorName",
      },
    },
    {
      $lookup: {
        from: "customers",
        localField: "customer_id",
        foreignField: "_id", 
        pipeline: [
          {
            $project: {
              name: 1,
              _id: 0
            }
          }
        ],
        as: "customerName"
      }
    }
  ]);

  res.send({ data: data });
};

const getAllMrs = async (req, res, next) => {
  const { franchiseeId } = req.query;
  const data = await reps.aggregate([
    { $project: { name: 1, franchisee_id: 1 } },
    { $match: { franchisee_id: ObjectId(franchiseeId) } },
  ]);
  res.send(data)
}

module.exports = {
  getCustomVisits,
  getByName,
  downloadDetails,
  getAllMrs
};
