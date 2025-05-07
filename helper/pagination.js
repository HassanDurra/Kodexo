const { Op } = require("sequelize");

const paginate = async (Model, { page, limit, where , paranoid = true , include = [] }) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {};

  const totalCount = await Model.count({
    where:where,
    paranoid:paranoid
  });
  results.total = totalCount;

  if (endIndex < totalCount) {
    results.next = { page: page + 1, limit: limit };
  }

  if (startIndex > 0) {
    results.previous = { page: page - 1, limit: limit };
  }
  results.totalPages = Math.ceil(totalCount / limit);
  results.data = await Model.findAll({
    where: where,
    paranoid:paranoid,
    offset: startIndex,
    limit: limit,
    include:include,
  });

  return results;
};
module.exports = { paginate };
