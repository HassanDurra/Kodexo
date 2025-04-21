const { hashPassword } = require("../helper/helper");
const { User } = require("../model/userModel");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

const createUser = async (req, res) => {
  try {
    const { name, email, password, user_name, image, user_role } = req.body;

    const hashedPassword = await hashPassword({ value: password });

    const createData = {
      name: name,
      email: email,
      password: hashedPassword,
      user_role: user_role,
      user_name: user_name,
      image: image ? image : null,
    };

    await User.create(createData);
    return res.status(201).json({
      message: `User with Name: '${name}' and Email: '${email}' has been Created!`,
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
    const users = await User.findAll({
      attributes: [
        "user_id",
        "user_name",
        "name",
        "email",
        "password",
        "user_role",
      ],
      where: {
        deleted_at: null,
      },
    });

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
          user_id: user_id,
        },
        returning: true, // For PostgreSQL to return the updated rows
      }
    );

    if (affectedRows > 0) {
      const updatedUser = await User.findByPk(user_id, {
        attributes: [
          "user_id",
          "user_name",
          "name",
          "email",
          "user_role",
          "updated_at",
        ],
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
          user_id: user_id,
        },
      }
    );

    if (affectedRows[0] > 0) {
      const deletedUser = await User.findByPk(user_id, { paranoid: false });
      res.status(200).json({
        message: "User deleted successfully",
        deletedUser: deletedUser ? deletedUser.get({ plain: true }) : null,
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
  console.time("DeleteUsersQuery"); // Start timing the query

  const { ids, deleted_by } = req.body; // Match frontend variable name

  // Validate user IDs
  if (!Array.isArray(ids) || ids.length === 0 || ids.some(isNaN)) {
    console.error("❌ Invalid or empty user ID list:", ids);
    console.timeEnd("DeleteUsersQuery");
    return res.status(400).json({ error: "Invalid or empty user ID list" });
  }

  // Validate deleted_by field
  if (!deleted_by || isNaN(deleted_by)) {
    console.error("❌ deleted_by is required and must be a valid number");
    console.timeEnd("DeleteUsersQuery");
    return res
      .status(400)
      .json({ error: "deleted_by is required and must be a valid number" });
  }

  try {
    const affectedRows = await User.update(
      {
        deleted_at: new Date(),
        deleted_by: deleted_by,
      },
      {
        where: {
          user_id: {
            [Op.in]: ids.map(Number), // Ensure IDs are numbers for Sequelize
          },
        },
      }
    );

    console.timeEnd("DeleteUsersQuery"); // End timing the query

    if (affectedRows[0] > 0) {
      const deletedUsers = await User.findAll({
        where: {
          user_id: {
            [Op.in]: ids.map(Number),
          },
        },
        paranoid: false, // Include soft-deleted records
        raw: true,
      });
      res.status(200).json({
        message: "✅ Users deleted successfully",
        deletedUsers: deletedUsers,
      });
    } else {
      res.status(404).json({ error: "No users found to delete" });
    }
  } catch (error) {
    console.timeEnd("DeleteUsersQuery"); // End timing the query
    console.error("❌ Error deleting users:", error);
    return res
      .status(500)
      .json({ error: "Database error", details: error.message });
  }
};
const getDeletedUsers = async (req, res) => {
  try {
    const deletedUsers = await User.findAll({
      where: {
        deleted_at: {
          [Op.ne]: null,
        },
      },
      paranoid: false,
    });

    res.status(200).json(deletedUsers);
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
          user_id: user_id,
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
const userStatus = async (req, res) => {
  const user_id = parseInt(req.params.user_id, 10);
  const { status } = req.body;

  if (
    typeof status !== "string" ||
    !["active", "inactive"].includes(status.toLowerCase())
  ) {
    return res
      .status(400)
      .json({ error: "Invalid status value. Must be 'active' or 'inactive'." });
  }

  try {
    const [affectedRows] = await User.update(
      {
        email_verified: (status.toLowerCase() == 'active' ? 1 : 0),
      },
      {
        where: {
          user_id: user_id,
        },
        returning: true,
      }
    );

    if (affectedRows > 0) {
      const updatedUser = await User.findByPk(user_id);
      res.status(200).json({
        message: `User ${user_id} status updated to ${status}`,
        user: updatedUser ? updatedUser.get({ plain: true }) : null,
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Database update error:", error);
    return res
      .status(500)
      .json({ error: "Database error", details: error.message });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  deleteMultipleUsers,
  getDeletedUsers,
  restoreUser,
  userStatus,
};
