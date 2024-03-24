import { Request, Response } from "express";
import AppDataSource from "../database/typeormConfig";
import { OrderMaster } from "../models/order";
import { OrderDetail } from "../models/orderDetail";
import { Product } from "../models/product";
import { paginated, sendResponse, sortedBy } from "../utility/utils";

export const addOrder = async (req: Request, res: Response): Promise<any> => {
  try {
    const { products } = req.body;
    const { user } = req;
    const productIds = products.map(
      (product: { productId: number }) => product.productId
    );
    const productRepository = AppDataSource.getRepository(Product);
    const [product, productCount] = await productRepository
      .createQueryBuilder("product")
      .where("product.id IN (:...productIds)", { productIds })
      .getManyAndCount();
    if (productIds.length > productCount) {
      return res
        .status(404)
        .json(sendResponse(false, "Some Product are not available.", null));
    }

    let totalAmount = 0;
    let totalAmountToPay = 0;
    let totalDiscount = 0;
    let totalItems = 0;
    let totalQauntity = 0;
    let errProduct = [];
    let orderDetailData = [];
    for (let i = 0; i < products.length; i++) {
      const prodFound = product.find(
        (item) => item.id == products[i].productId
      );
      if (prodFound && prodFound.countInStock >= products[i].qty) {
        const originalPrice = prodFound.price;
        const discountPercentage = prodFound.discount / 100;
        const discount = originalPrice * discountPercentage;
        const discountedPricePerUnit = originalPrice - discount;
        const subtTotalAmount = products[i].qty * discountedPricePerUnit;
        totalQauntity += products[i].qty;
        totalAmount += originalPrice * products[i].qty;
        totalAmountToPay += subtTotalAmount;
        totalDiscount += discount * products[i].qty;
        totalItems++;
        orderDetailData.push({
          price: prodFound.price,
          discount: prodFound.discount,
          quantity: products[i].qty,
          totalPrice: originalPrice * products[i].qty,
          totalDiscountedPrice: subtTotalAmount,
          totalDiscountPrice: discount * products[i].qty,
          product: { id: prodFound.id },
        });
      } else {
        errProduct.push({
          ...products[i],
          availableStockCount: prodFound?.countInStock,
        });
      }
    }
    if (errProduct.length) {
      return res
        .status(404)
        .json(
          sendResponse(
            false,
            "Please check with the product quantity.",
            errProduct
          )
        );
    }

    //update stock of product
    for (const { productId, qty } of products) {
      await productRepository
        .createQueryBuilder()
        .update(Product)
        .set({ countInStock: () => `countInStock - ${qty}` })
        .where("id = :productId", { productId })
        .execute();
    }

    const orderMasterRepository = AppDataSource.getRepository(OrderMaster);
    let orderMasterObj = orderMasterRepository.create({
      totalAmount,
      totalAmountToPay,
      totalDiscount,
      totalItems,
      totalQauntity,
      createdBy: user?.userId,
    });
    orderMasterObj = await orderMasterRepository.save(orderMasterObj);
    orderDetailData = orderDetailData.map((item) => {
      return {
        ...item,
        order: { id: orderMasterObj.id },
      };
    });
    await AppDataSource.createQueryBuilder()
      .insert()
      .into(OrderDetail)
      .values(orderDetailData)
      .execute();
    return res.status(200).json(
      sendResponse(true, "Successfully older placed.", {
        ...orderMasterObj,
        // totalAmount,
        // totalAmountToPay,
        // totalDiscount,
        // totalItems,
        // totalQauntity,
        // errProduct,
        // product,
      })
    );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(sendResponse(false, "Something went wrong.", null));
  }
};

export const getMyOrders = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { user } = req;
    const { page = 1, perPage = 20, sortBy, sortType } = req.query;
    const paginatedRes = paginated(Number(page), Number(perPage));
    const sortedByRes = sortedBy(sortBy as string, sortType as string);
    const orderMasterRepository = AppDataSource.getRepository(OrderMaster);
    const dbQuery = orderMasterRepository
      .createQueryBuilder("orderMaster")
      .where("orderMaster.createdBy = :createdBy", { createdBy: user?.userId })
      .leftJoinAndSelect("orderMaster.orderDetails", "orderDetails")
      .take(paginatedRes.limit)
      .offset(paginatedRes.offset);

    //sorting
    dbQuery.orderBy(`orderMaster.${sortedByRes[0]}`, `${sortedByRes[1]}`);

    //query execution
    const [orderMasterList, orderCount] = await dbQuery.getManyAndCount();

    return res.status(200).json(
      sendResponse(true, "Successfully got the category list.", {
        list: orderMasterList,
        count: orderCount,
      })
    );
  } catch (error) {
    console.error(error);

    return res
      .status(500)
      .json(sendResponse(false, "Something went wrong.", null));
  }
};

export const getOrderById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { orderId } = req.params;
    const orderMasterRepository = AppDataSource.getRepository(OrderMaster);
    const orderMasterData = await orderMasterRepository
      .createQueryBuilder("orderMaster")
      .where("orderMaster.id = :id", { id: orderId })
      .leftJoinAndSelect("orderMaster.orderDetails", "orderDetails")
      .getOne();
    if (!orderMasterData) {
      return res
        .status(404)
        .json(sendResponse(false, "Order not found.", null));
    }
    return res
      .status(200)
      .json(
        sendResponse(
          true,
          "Successfully got the category list.",
          orderMasterData
        )
      );
  } catch (error) {
    console.error(error);

    return res
      .status(500)
      .json(sendResponse(false, "Something went wrong.", null));
  }
};

export const getAllOrders = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { page = 1, perPage = 20, sortBy, sortType } = req.query;
    const paginatedRes = paginated(Number(page), Number(perPage));
    const sortedByRes = sortedBy(sortBy as string, sortType as string);
    const orderMasterRepository = AppDataSource.getRepository(OrderMaster);
    const dbQuery = orderMasterRepository
      .createQueryBuilder("orderMaster")
      .leftJoinAndSelect("orderMaster.orderDetails", "orderDetails")
      .take(paginatedRes.limit)
      .offset(paginatedRes.offset);

    //sorting
    dbQuery.orderBy(`orderMaster.${sortedByRes[0]}`, `${sortedByRes[1]}`);

    //query execution
    const [orderMasterList, orderCount] = await dbQuery.getManyAndCount();
    return res.status(200).json(
      sendResponse(true, "Successfully got the category list.", {
        list: orderMasterList,
        count: orderCount,
      })
    );
  } catch (error) {
    console.error(error);

    return res
      .status(500)
      .json(sendResponse(false, "Something went wrong.", null));
  }
};
