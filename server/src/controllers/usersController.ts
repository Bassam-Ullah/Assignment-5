// import express from "express";
import { Request, Response } from "express";

const pool = require("../util/db");

exports.getUsers = async (req: Request, res: Response) => {
  //   console.log("Get route got hit");
  //   res.status(200).json({ message: "Hello" });

  try {
    const allUsers = await pool.query("SELECT * FROM demousers;");
    res.json(allUsers.rows);
  } catch (err) {
    console.log(err);
  }
};

exports.postUser = async (req: Request, res: Response) => {
  try {
    console.log("POSt route");

    const id: number = Number(req.body.user_id);
    const { firstname } = req.body;
    const { lastname } = req.body;
    const { middlename } = req.body;
    const { user_email } = req.body;
    const { user_phone } = req.body;
    const { user_role } = req.body;
    const { user_address } = req.body;
    const newUser = {
      id: id,
      firstname: firstname,
      middlename: middlename,
      lastname: lastname,
      email: user_email,
      phone: user_phone,
      role: user_role,
      address: user_address,
    };
    console.log(newUser);

    await pool.query(
      "INSERT INTO demousers(user_id,firstname,middlename,lastname,user_email,user_phone,user_role,user_address) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *",
      [
        id,
        firstname,
        middlename,
        lastname,
        user_email,
        user_phone,
        user_role,
        user_address,
      ]
    );

    const allUsers = await pool.query("SELECT * FROM demousers");
    console.log(allUsers.rows);

    res.status(200).json(allUsers.rows);
  } catch (error) {
    console.log(error);
  }
};

exports.updateUser = async (req: Request, res: Response) => {
  try {
    const id: number = Number(req.params.id);
    await pool.query(
      "UPDATE demousers SET firstname=($1),middlename=($2),lastname=($3),user_email=($4),user_phone=($5),user_role=($6),user_address=($7) WHERE user_id=($8)",
      [
        req.body.firstname,
        req.body.middlename,
        req.body.lastname,
        req.body.user_email,
        req.body.user_phone,
        req.body.user_role,
        req.body.user_address,
        id,
      ]
    );

    const allUsers = await pool.query("SELECT * FROM demousers");
    res.status(200).json(allUsers.rows);
  } catch (error) {
    console.log(error);
  }
};

exports.deleteUser = async (req: Request, res: Response) => {
  try {
    const id: number = Number(req.params.id);
    await pool.query("DELETE FROM demousers WHERE user_id=($1)", [id]);
    const allUsers = await pool.query("SELECT * FROM demousers");
    res.status(200).json(allUsers.rows);
  } catch (error) {
    console.log(error);
  }
};
