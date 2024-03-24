import { Request, Response } from "express";
import { Not } from "typeorm";
import AppDataSource from "../database/typeormConfig";
import { Category } from "../models/category";
import { sendResponse } from "../utility/utils";

export const getAllCategory = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { user } = req;
    const categoryRepository = AppDataSource.getRepository(Category);
    const [categoryList, categoryCount] = await categoryRepository
      .createQueryBuilder("category")
      .leftJoinAndSelect("category.products", "product")
      .getManyAndCount();
    return res.status(200).json(
      sendResponse(true, "Successfully got the category list.", {
        list: categoryList,
        count: categoryCount,
      })
    );
  } catch (error) {
    console.error(error);

    return res
      .status(500)
      .json(sendResponse(false, "Something went wrong.", null));
  }
};

export const getCategoryById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const categoryRepository = AppDataSource.getRepository(Category);
    let existingCategory = await categoryRepository.findOne({
      where: { id: Number(id) },
    });
    if (!existingCategory) {
      return res
        .status(400)
        .json(sendResponse(false, "Category not found.", null));
    }
    return res
      .status(200)
      .json(
        sendResponse(true, "Category fetched successfully.", existingCategory)
      );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(sendResponse(false, "Something went wrong.", null));
  }
};

export const addCategory = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { user } = req;
    const { name, desc, image } = req.body;
    const categoryRepository = AppDataSource.getRepository(Category);
    const existingCategory = await categoryRepository.findOne({
      where: { name },
    });
    if (existingCategory) {
      return res
        .status(400)
        .json(sendResponse(false, "Already category exists.", null));
    }
    let category = categoryRepository.create({
      name,
      desc,
      image,
      createdBy: user?.userId,
    });
    category = await categoryRepository.save(category);
    return res
      .status(200)
      .json(sendResponse(true, "Category added successfully.", category));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(sendResponse(false, "Something went wrong.", null));
  }
};

export const upadteCategory = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { user } = req;
    const { name, desc, image } = req.body;
    const { id } = req.params;
    const categoryRepository = AppDataSource.getRepository(Category);
    let deplicateCategory = await categoryRepository.findOne({
      where: { id: Not(Number(id)), name },
    });
    if (deplicateCategory) {
      return res
        .status(400)
        .json(sendResponse(false, "Category already exists.", null));
    }
    let existingCategory = await categoryRepository.findOne({
      where: { id: Number(id) },
    });
    if (!existingCategory) {
      return res
        .status(400)
        .json(sendResponse(false, "Category not found.", null));
    }
    existingCategory.name = name;
    existingCategory.desc = desc;
    existingCategory.image = image;
    existingCategory.updatedBy = user?.userId ? user?.userId : null;
    existingCategory = await categoryRepository.save(existingCategory);
    return res
      .status(200)
      .json(
        sendResponse(true, "Category update successfully.", existingCategory)
      );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(sendResponse(false, "Something went wrong.", null));
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params; // Assuming you pass the category ID in the URL params
    const categoryRepository = AppDataSource.getRepository(Category);
    const category = await categoryRepository.findOne({
      where: { id: Number(id) },
    });
    if (!category) {
      return res
        .status(404)
        .json(sendResponse(false, "Category not found.", null));
    }
    await categoryRepository.remove(category);
    return res
      .status(200)
      .json(sendResponse(true, "Category deleted successfully.", null));
  } catch (error) {
    return res
      .status(500)
      .json(sendResponse(false, "Something went wrong.", null));
  }
};
