const { hashPassword } = require("../helper/helper");
const { paginate } = require("../helper/pagination");
const { User } = require("../model/userModel");
const { Op } = require("sequelize");

const createUser = async (req, res) => {
  try {
    const { name, email, password, user_name, image, user_role , active } = req.body;

    const hashedPassword = await hashPassword({ value: password });

    const createData = {
      name: name,
      email: email,
      password: hashedPassword,
      user_role: user_role,
      user_name: user_name,
      email_verified: active ? 1 : 0 ,
      image: image ? image : null,
    };

    await User.create(createData);
    return res.status(201).json({
      message: "User Created Successfully..!",
    });
  } catch (error) {
    const errorMessage = Object.values(error.errors)
      .map((val) => val.message)
      .join(", ");
    return res.status(500).json({ message: errorMessage });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const {page , limit} = req.query;
    const users = await paginate(User , {page: parseInt( page ?? 1 ) ,limit: parseInt(limit ?? 10) , where:{ deleted_at: null , role:{ [Op.ne]: '1' } }});

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const getUserById = async (req, res) => {
  const user_id = parseInt(req.params.user_id);

  try {
    const user = await User.findByPk(user_id);

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: `User with ID ${user_id} not found` });
    }
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const updateUser = async (req, res) => {
  const user_id = parseInt(req.params.user_id);
  const { user_name, name, email, password, user_role, updated_by } = req.body;

  try {
    const [affectedRows] = await User.update(
      {
        user_name: user_name,
        name: name,
        email: email,
        password: password,
        user_role: user_role,
        updated_by: updated_by,
        updated_at: new Date(), // Sequelize automatically handles this with timestamps: true
      },
      {
        where: {
          id: user_id,
        },
        returning: true, // For PostgreSQL to return the updated rows
      }
    );

    if (affectedRows > 0) {
      const updatedUser = await User.findByPk(user_id, {
        attributes: ["user_name", "name", "email", "user_role", "updated_at"],
      });
      res.status(200).json({
        message: `User updated successfully`,
        user: updatedUser ? updatedUser.get({ plain: true }) : null,
      });
    } else {
      res.status(404).json({ message: `User with ID ${user_id} not found` });
    }
  } catch (error) {
    console.error("❌ Error updating user:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};
const deleteUser = async (req, res) => {
  const user_id = parseInt(req.params.user_id);
  const { deleted_by } = req.body;
  try {
    const affectedRows = await User.update(
      {
        deleted_at: new Date(),
        deleted_by: deleted_by,
      },
      {
        where: {
          id: user_id,
        },
      }
    );

    if (affectedRows[0] > 0) {
      res.status(200).json({
        message: "User deleted successfully",
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};
const destroyUser = async (req, res) => {
  const user_id = parseInt(req.params.user_id);
  try {
    const affectedRows = await User.destroy(
      {
        where: {
          id: user_id,
        },
        force:true,
      }
    );

    if (affectedRows) {
      res.status(200).json({
        message: "User deleted successfully",
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};
const destroyMultipleUsers = async (req, res) => {
  const { ids } = req.body;
  try {
    const affectedRows = await User.destroy(
      {
        where: {
          id:{[Op.in]: ids},
        },
        force:true,
      }
    );

    if (affectedRows) {
      res.status(200).json({
        message: "User deleted successfully",
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};
const deleteMultipleUsers = async (req, res) => {
  console.time("DeleteUsersQuery");

  const { ids, deleted_by } = req.body;


  if (!deleted_by || isNaN(deleted_by)) {
    return res
      .status(400)
      .json({ error: "Deleted By is required ..!" });
  }

  try {
    const affectedRows = await User.update(
      {
        deleted_at: new Date(),
        deleted_by: deleted_by,
      },
      {
        where: {
          id: {
            [Op.in]: ids.map(Number), // Ensure IDs are numbers for Sequelize
          },
        },
      }
    );
    if (affectedRows[0] > 0) {
      const deletedUsers = await User.findAll({
        where: {
          id: {
            [Op.in]: ids.map(Number),
          },
        },
        paranoid: false,
        raw: true,
      });
      res.status(200).json({
        message: "Users deleted successfully",
        deletedUsers: deletedUsers,
      });
    } else {
      res.status(404).json({ error: "No users found to delete" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Database error", details: error.message });
  }
};
const getDeletedUsers = async (req, res) => {
  try {
    const {page , limit} = req.query;
    const users = await paginate(User , {page: parseInt( page ?? 1 ) ,limit: parseInt(limit ?? 10) , where:{ deleted_at: {[Op.ne]:null} , role:{ [Op.ne]: '1' } },paranoid:false , include:[{
      model: User,
      as: 'DeletedByUser',
      attributes:['name']
    },] });
    res.status(200).json(users);

  } catch (error) {
    console.error("Error fetching deleted users:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const restoreUser = async (req, res) => {
  const user_id = parseInt(req.params.user_id);

  try {
    const [affectedRows] = await User.update(
      {
        deleted_at: null,
        deleted_by: null,
      },
      {
        where: {
          id: user_id,
          deleted_at: { [Op.ne]: null },
        },
        returning: true,
      }
    );

    if (affectedRows > 0) {
      const restoredUser = await User.findByPk(user_id);
      res.status(200).json({
        message: "User restored successfully",
        restoredUser: restoredUser ? restoredUser.get({ plain: true }) : null,
      });
    } else {
      res.status(404).json({ error: "User Not Found or Not Deleted" });
    }
  } catch (error) {
    console.error("Error restoring user:", error);
    res.status(500).json({ error: "Server Internal Error" });
  }
};

const restoreMultipleUsers = async (req, res) => {
  const { ids, deleted_by } = req.body;

  try {
    const affectedRows = await User.restore(
      {
        where: {
          id: {
            [Op.in]: ids.map(Number),
          },
        },
      }
    );

    if (affectedRows) {
      res.status(200).json({
        message: "Users Restored Successfully",
      });
    } else {
      res.status(404).json({ error: "No users found to Restore" });
    }
  } catch (error) {
    console.error("❌ Error Restoring users:", error);
    return res
      .status(500)
      .json({ error: "Database error", details: error.message });
  }
};
const userStatus = async (req, res) => {
  const id = req.params.id ;
  const { status , updated_by } = req.body;


  try {
    const [affectedRows] = await User.update(
      { email_verified : status , updated_by : updated_by },
      {
        where: { id: id },
      }
    );
    if (affectedRows > 0) {
      const userData = await User.findByPk(id);
      res.status(200).json({
        message: `User account  with email: ${userData.email}  has been  ${ (status == 1 ? 'Activated':'Deactivated' )}`,
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Database update error:", error);
    return res.status(500).json({
      error: "Database error",
      details: error.message,
    });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  destroyUser,
  deleteMultipleUsers,
  destroyMultipleUsers,
  getDeletedUsers,
  restoreUser,
  restoreMultipleUsers,
  userStatus,
};
