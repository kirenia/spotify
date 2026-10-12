import { DataTypes } from "sequelize";
import { sequelize } from "../db/index.js";

export const Token = sequelize.define("Token", {
  accessToken: { type: DataTypes.TEXT, allowNull: false },
  refreshToken: { type: DataTypes.TEXT, allowNull: false },
  expiresAt: { type: DataTypes.DATE, allowNull: false },
});
