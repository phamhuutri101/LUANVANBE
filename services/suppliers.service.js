const SuppliersSchema = require("../models/suppliers");
const ObjectId = require("mongoose").Types.ObjectId;
const randomCode = require("../utils/code");
const codeSupplier = randomCode();
class Suppliers {
  static addSuppliers = async (
    name_suppliers,
    province,
    district,
    commune,
    desc,
    code_supplier
  ) => {
    const newSuppliers = await SuppliersSchema.create({
      NAME_SUPPLIERS: name_suppliers,
      ADDRESS_SUPPLIERS: {
        PROVINCE: province,
        DISTRICT: district,
        COMMUNE: commune,
        DESC: desc,
      },
      CREATED_AT: new Date(),
      UPDATED_AT: null,
      CODE_SUPPLIERS: code_supplier,
    });
    return newSuppliers;
  };
  static getSuppliers = async () => {
    const suppliers = await SuppliersSchema.find({ IS_DELETED: false });
    return suppliers;
  };
  static getSuppliersById = async (id) => {
    const suppliers = await SuppliersSchema.findById(id);
    return suppliers;
  };
  static updateSuppliers = async (
    id,
    name_suppliers,
    province,
    district,
    commune,
    desc,
    code_supplier
  ) => {
    const ID = new ObjectId(id);
    const updateSuppliers = await SuppliersSchema.updateOne(
      {
        _id: ID,
      },
      {
        NAME_SUPPLIERS: name_suppliers,
        ADDRESS_SUPPLIERS: {
          PROVINCE: province,
          DISTRICT: district,
          COMMUNE: commune,
          DESC: desc,
        },
        UPDATED_AT: new Date(),
        CODE_SUPPLIERS: code_supplier,
      }
    );
    return updateSuppliers;
  };
  static deleteSuppliers = async (id) => {
    const ID = new ObjectId(id);
    const deleteSuppliers = await SuppliersSchema.updateOne(
      {
        _id: ID,
      },
      {
        IS_DELETED: true,
      }
    );
    return deleteSuppliers;
  };
}
module.exports = Suppliers;
