import React, { forwardRef, useRef, useContext, useEffect } from "react";
import swal from "sweetalert";
import { DeleteOutline, Edit, ViewList } from "@material-ui/icons";

import { Button } from "../../../components/CustomControl/Button";
import moment from "moment";

import {
  Typography,
  TextField,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

import CustomTable from "components/CustomTable/CustomTable";
import {
  apiCall,
  apiOption,
  LoginUserInfo,
  language,
} from "../../../actions/api";
import ExecuteQueryHook from "../../../components/hooks/ExecuteQueryHook";

const PGDataCollection = (props) => {
  const serverpage = "pgdatacollection"; // this is .php server page

  const { useState } = React;
  const [bFirst, setBFirst] = useState(true);
  const [listEditPanelToggle, setListEditPanelToggle] = useState(false); //when true then show list, when false then show add/edit
  const [supplierList, setSupplierList] = useState(null);
  const [productList, setProductList] = useState(null);
  const [datatypeList, setDataTypeList] = useState(null);


  const initialYearList = [
    { id: "", name: "-Select a year-" },
    { id: "2023", name: "2023" },
    { id: "2024", name: "2024" },
    { id: "2025", name: "2025" },
    { id: "2026", name: "2026" },
    { id: "2027", name: "2027" },
    { id: "2028", name: "2028" },
    { id: "2029", name: "2029" },
    { id: "2030", name: "2030" }
  ];
  const [yearList, setYearList] = useState(initialYearList);



  const initialQuarterList = [
    { id: "", name: "-Select a quarter-" },
    { id: "Q1", name: "Jan-Mar" },
    { id: "Q2", name: "Apr-Jun" },
    { id: "Q3", name: "Jul-Sep" },
    { id: "Q4", name: "Oct-Dec" }
  ];
  const [quarterList, setQuarterList] = useState(initialQuarterList);


  const initialPgGroupList = [
    { id: "", name: "-Select a group-" },
    { "id": 1, "name": "গাজীবাড়ী ডেইরী পিজি" },
    { "id": 2, "name": "গোপেরবাড়ী ডেইরী পিজি" },
    { "id": 3, "name": "তরফরাজাঘাট ডেইরী পিজি" },
    { "id": 4, "name": "চানপুর কবুতর পিজি" },
    { "id": 5, "name": "পলাশবাড়ী ভেড়া পিজি" },
    { "id": 6, "name": "নামাগেন্ডা ডেইরী পিজি" },
    { "id": 7, "name": "ডেন্ডাবর ডেইরী পিজি" },
    { "id": 8, "name": "দক্ষিণ রাজাশন ডেইরী পিজি" },
    { "id": 9, "name": "নয়াপাড়া দেশী মুরগি পিজি" },
    { "id": 10, "name": "পুরানবাড়ী দেশী মুরগি পিজি" },
    { "id": 11, "name": "কাকাব ছাগল পিজি" },
    { "id": 12, "name": "সামাইর ডেইরী পিজি" },
    { "id": 13, "name": "সাধাপুর গরু হৃষ্টপুষ্টকরণ পিজি" },
    { "id": 14, "name": "নয়াপাড়া ডেইরী পিজি" },
    { "id": 15, "name": "তৈয়বপুর ডেইরী পিজি" },
    { "id": 16, "name": "খাগুরিয়া ডেইরী পিজি" },
    { "id": 17, "name": "কুমকুমারী ছাগল পিজি" }
  ];
  const [PgGroupList, setPgGroupList] = useState(initialPgGroupList);


  // const [selectedSupplier, setSelectedSupplier] = useState({});
  // const [selectedValue, setSelectedValue] = useState("");
  // const [selectedSupplier, setSelectedSupplier] = useState({
  //   id: "",
  //   name: "Select supplier",
  // });
  // const [selectedSupplier, setSelectedSupplier] = useState(null);
  // const [isLoading, setIsLoading] = useState(true);
  // const [supplierList, setSupplierList] = useState([{ id: "", name: "Select supplier" }]);

  const [currentInvoice, setCurrentInvoice] = useState([]); //this is for master information. It will send to sever for save
  const [currentMany, setCurrentMany] = useState([]); //this is for many one record add/edit
  const [manyDataList, setManyDataList] = useState([]); //This is for many table. It will send to sever for save
  const [deletedItems, setDeletedItems] = useState([]); //Which products delete from many

  const [currentDate, setCurrentDate] = useState(
    //new Date()
    moment().format("YYYY-MM-DD")
  );

  // const [currentRow, setCurrentRow] = useState([]);
  const [errorObjectMaster, setErrorObjectMaster] = useState({});
  const [errorObjectMany, setErrorObjectMany] = useState({});

  // const [showModal, setShowModal] = useState(false); //true=show modal, false=hide modal

  const { isLoading, data: dataList, error, ExecuteQuery } = ExecuteQueryHook(); //Fetch data master list

  const {
    isLoading: isLoadingSingle,
    data: dataListSingle,
    error: errorSingle,
    ExecuteQuery: ExecuteQuerySingle,
  } = ExecuteQueryHook(); //Fetch data for single

  const UserInfo = LoginUserInfo();

  /* =====Start of Excel Export Code==== */
  // const EXCEL_EXPORT_URL = process.env.REACT_APP_API_URL;

  // const PrintPDFExcelExportFunction = (reportType) => {
  //   let finalUrl = EXCEL_EXPORT_URL + "report/print_pdf_excel_server.php";

  //   window.open(
  //     finalUrl +
  //       "?action=StrengthExport" +
  //       "&reportType=" +
  //       reportType +
  //       "&TimeStamp=" +
  //       Date.now()
  //   );
  // };
  /* =====End of Excel Export Code==== */

  const newInvoice = () => {
    setManyDataList([]);
    setDeletedItems([]);

    let params = {
      action: "NextInvoiceNumber",
      lan: language(),
      UserId: UserInfo.UserId,
      ClientId: UserInfo.ClientId,
      BranchId: UserInfo.BranchId,
      TransactionTypeId: 1,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setCurrentInvoice({
        id: "",
        TransactionTypeId: 1,
        TransactionDate: currentDate,
        InvoiceNo: res.data.datalist,
        SupplierId: "",
        ChallanNo: "",
        BPosted: 0,
        Remarks: "",
        ImageUrl: "",

        SumSubTotalAmount: "",
        SumVatAmount: "",
        SumDiscountAmount: "",
        SumCommission: "",
        SumTotalAmount: "",
        NetPaymentAmount: "",
      });
    });

    resetMany();
  };

  function resetMany() {
    setCurrentMany({
      DataTypeId: "",
      TransactionItemsId: "",
      TransactionId: "",
      ProductId: "",
      Quantity: "",
      BonusQty: "",
      TradePrice: "",
      VatonTrade: "",
      MRP: "",
      OrderQty: "",
      MfgDate: "",
      ExpDate: "",
      VatAmount: "",
      DiscountPercentage: "",
      DiscountAmount: "",
      SubTotalAmount: "",
      NewCost: "",
      Commission: "",
      TotalAmount: "",
      QuarterId: "",
      YearId: "",
      PgGroupId: "",
    });
  }

  /**Get data for table list */
  function getDataList() {
    let params = {
      action: "getDataList",
      lan: language(),
      UserId: UserInfo.UserId,
      ClientId: UserInfo.ClientId,
      BranchId: UserInfo.BranchId,
      TransactionTypeId: 1,
    };
    // console.log('LoginUserInfo params: ', params);

    ExecuteQuery(serverpage, params);
  }

  if (bFirst) {
    /**First time call for datalist */
    newInvoice();

    getSupplierList();
    getProductList();
    getDataTypeList();

    getDataList(); //invoice list

    setBFirst(false);
  }

  function addData() {
    newInvoice();
    setListEditPanelToggle(false); // false = hide list and show add/edit panel
  }

  function getSupplierList() {
    let params = {
      action: "SupplierList",
      lan: language(),
      UserId: UserInfo.UserId,
      ClientId: UserInfo.ClientId,
      BranchId: UserInfo.BranchId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setSupplierList(
        [{ id: "", name: "Select supplier" }].concat(res.data.datalist)
      );
    });
  }

  function getProductList() {
    let params = {
      action: "ProductList",
      lan: language(),
      UserId: UserInfo.UserId,
      ClientId: UserInfo.ClientId,
      BranchId: UserInfo.BranchId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setProductList(
        [{ id: "", name: "Select product" }].concat(res.data.datalist)
      );
    });
  }

  function getDataTypeList() {
    let params = {
      action: "DataTypeList",
      lan: language(),
      UserId: UserInfo.UserId,
      ClientId: UserInfo.ClientId,
      BranchId: UserInfo.BranchId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setDataTypeList(
        [{ id: "", name: "-Select a group-" }].concat(res.data.datalist)
      );
    });
  }

 /*  const masterColumnList = [
    { field: "rownumber", label: "SL", align: "center", width: "5%" },
    // { field: 'SL', label: 'SL',width:'10%',align:'center',visible:true,sort:false,filter:false },
    {
      field: "TransactionDate",
      label: "Date",
      width: "10%",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
    },
    {
      field: "InvoiceNo",
      label: "Invoice No.",
      width: "15%",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
    },
    {
      field: "SupplierName",
      label: "Supplier",
      align: "left",
      // width: "30%",
      visible: true,
      sort: true,
      filter: true,
    },
    {
      field: "ChallanNo",
      label: "Challan No.",
      width: "10%",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
    },
    {
      field: "NetPaymentAmount",
      label: "Net Payment",
      width: "10%",
      align: "right",
      type: "number",
      visible: true,
      sort: true,
      filter: true,
    },
    {
      field: "StatusName",
      label: "Status",
      width: "5%",
      align: "center",
      visible: true,
      sort: true,
      filter: true,
    },
    {
      field: "custom",
      label: "Action",
      width: "5%",
      align: "center",
      visible: true,
      // sort: false,
      // filter: false,
    },
  ]; */

  /** Action from table row buttons*/
  function actioncontrolmaster(rowData) {
    return (
      <>
        {rowData.BPosted === 0 && (
          <Edit
            className={"table-edit-icon"}
            onClick={() => {
              editData(rowData);
            }}
          />
        )}

        {rowData.BPosted === 0 && (
          <DeleteOutline
            className={"table-delete-icon"}
            onClick={() => {
              deleteData(rowData);
            }}
          />
        )}

        {rowData.BPosted === 1 && (
          <ViewList
            className={"table-view-icon"}
            onClick={() => {
              viewData(rowData);
            }}
          />
        )}
      </>
    );
  }

  const editData = (rowData) => {
    getDataSingleFromServer(rowData.id);
  };

  const viewData = (rowData) => {
    getDataSingleFromServer(rowData.id);
  };

  const getDataSingleFromServer = (id) => {
    let params = {
      action: "getDataSingle",
      lan: language(),
      UserId: UserInfo.UserId,
      ClientId: UserInfo.ClientId,
      BranchId: UserInfo.BranchId,
      id: id,
    };

    // const [currentInvoice, setCurrentInvoice] = useState([]); //this is for master information. It will send to sever for save
    // const [currentMany, setCurrentMany] = useState([]); //this is for many one record add/edit
    // const [manyDataList, setManyDataList] = useState([]); //This is for many table. It will send to sever for save
    // const [deletedItems, setDeletedItems] = useState([]); //Which products delete from many
    setDeletedItems([]);

    ExecuteQuerySingle(serverpage, params);
    resetMany();

    setListEditPanelToggle(false); // false = hide list and show add/edit panel
  };

  useEffect(() => {
    console.log("dataListSingle: ", dataListSingle);

    if (dataListSingle.master) {
      // console.log('dataListSingle: ', dataListSingle.master[0]);
      setCurrentInvoice(dataListSingle.master[0]);
    }
    if (dataListSingle.items) {
      setManyDataList(dataListSingle.items);
      // console.log('dataListSingle: ', dataListSingle.items[0]);
    }
  }, [dataListSingle]);

  const backToList = () => {
    setListEditPanelToggle(true); // true = show list and hide add/edit panel
    getDataList(); //invoice list
  };

  const printInvoice = () => {
    console.log("Print not done yet.");
  };

  const deleteData = (rowData) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this data!",
      icon: "warning",
      buttons: {
        confirm: {
          text: "Yes",
          value: true,
          visible: true,
          className: "",
          closeModal: true,
        },
        cancel: {
          text: "No",
          value: null,
          visible: true,
          className: "",
          closeModal: true,
        },
      },
      dangerMode: true,
    }).then((allowAction) => {
      if (allowAction) {
        deleteApi(rowData);
      }
    });
  };

  function deleteApi(rowData) {
    let params = {
      action: "deleteData",
      lan: language(),
      UserId: UserInfo.UserId,
      ClientId: UserInfo.ClientId,
      BranchId: UserInfo.BranchId,
      rowData: rowData,
    };

    apiCall.post(serverpage, { params }, apiOption()).then((res) => {
      // console.log('res: ', res);
      props.openNoticeModal({
        isOpen: true,
        msg: res.data.message,
        msgtype: res.data.success,
      });
      getDataList();
    });
  }

  const handleChangeMaster = (e) => {
    // console.log('e: ', e);

    const { name, value } = e.target;
    // console.log('value: ', value);
    // console.log('name: ', name);
    let data = { ...currentInvoice };
    data[name] = value;

    if (name === "SumCommission") {
      let SumTotalAmount =
        data["SumTotalAmount"] === "" ? 0 : parseFloat(data["SumTotalAmount"]);
      let SumCommission =
        data["SumCommission"] === "" ? 0 : parseFloat(data["SumCommission"]);
      let NetPaymentAmount = (SumTotalAmount - SumCommission).toFixed(0);

      data["NetPaymentAmount"] = NetPaymentAmount;
    }
    setCurrentInvoice(data);
    // console.log("data handleChangeMaster: ", data);

    setErrorObjectMaster({ ...errorObjectMaster, [name]: null });
    // const [errorObjectMaster, setErrorObjectMaster] = useState({});
  };

  const handleChangeChoosenMaster = (name, value) => {
    let data = { ...currentInvoice };
    data[name] = value;
    setCurrentInvoice(data);
    // console.log("data: ", data);

    // setErrorObject({ ...errorObject, [name]: null });
    setErrorObjectMaster({ ...errorObjectMaster, [name]: null });
  };

  const handleChangeMany = (e) => {
    // console.log('e: ', e);

    const { name, value } = e.target;
    // console.log('value: ', value);
    // console.log('name: ', name);
    let data = { ...currentMany };
    data[name] = value;

    // console.log("data handleChangeMany: ", data);
    if (
      name === "TradePrice" ||
      name === "Quantity" ||
      name === "BonusQty" ||
      name === "VatonTrade" ||
      name === "DiscountPercentage" ||
      name === "DiscountAmount" ||
      name === "SubTotalAmount"
    ) {
      setCurrentMany(calculationManyFields(name, data));
    } else {
      setCurrentMany(data);
    }

    setErrorObjectMany({ ...errorObjectMany, [name]: null });
  };

  const handleChangeChoosenMany = (name, value) => {
    let data = { ...currentMany };
    data[name] = value;

    /**when select product then some value take from product metadata */
    if (name === "ProductId") {
      var selectedProduct = productList.filter((prod) => prod.id === value);

      // console.log('selectedProduct: ', selectedProduct);
      // console.log('selectedProduct TradePrice: ', selectedProduct[0].TradePrice);
      // console.log('selectedProduct MRP: ', selectedProduct[0].MRP);
      // console.log('selectedProduct VatonTrade: ', selectedProduct[0].VatonTrade);

      data["TradePrice"] = selectedProduct[0].TradePrice;
      data["MRP"] = selectedProduct[0].MRP;
      data["VatonTrade"] = selectedProduct[0].VatonTrade;

      setCurrentMany(calculationManyFields(name, data));
    } else {
      setCurrentMany(data);
    }

    // console.log("data handleChangeChoosenMany: ", data);

    setErrorObjectMany({ ...errorObjectMany, [name]: null });
  };

  const calculationManyFields = (name, data) => {
    // console.log("data: ", data);

    /**when type subtotal then no need calculate subtotal */
    if (name !== "SubTotalAmount") {
      data["SubTotalAmount"] = parseFloat(
        (data["TradePrice"] === "" ? 0 : parseFloat(data["TradePrice"])) *
          (data["Quantity"] === "" ? 0 : parseInt(data["Quantity"]))
      ).toFixed(2);
    }

    data["VatAmount"] = parseFloat(
      ((data["SubTotalAmount"] === ""
        ? 0
        : parseFloat(data["SubTotalAmount"])) *
        (data["VatonTrade"] === "" ? 0 : parseFloat(data["VatonTrade"]))) /
        100
    ).toFixed(2);

    /**when type DiscountAmount then no need calculate DiscountAmount */
    if (name !== "DiscountAmount" && data["DiscountPercentage"] !== "") {
      data["DiscountAmount"] = parseFloat(
        ((data["SubTotalAmount"] === ""
          ? 0
          : parseFloat(data["SubTotalAmount"])) *
          (data["DiscountPercentage"] === ""
            ? 0
            : parseFloat(data["DiscountPercentage"]))) /
          100
      ).toFixed(2);
    }

    /**when type TotalAmount then no need calculate TotalAmount */
    // if (name !== "TotalAmount") {
    data["TotalAmount"] = parseFloat(
      (data["SubTotalAmount"] === "" ? 0 : parseFloat(data["SubTotalAmount"])) +
        (data["VatAmount"] === "" ? 0 : parseFloat(data["VatAmount"])) -
        (data["DiscountAmount"] === "" ? 0 : parseFloat(data["DiscountAmount"]))
    ).toFixed(2);
    // }

    /**when type NewCost then no need calculate NewCost */
    if (name !== "NewCost") {
      data["NewCost"] = parseFloat(
        (data["TotalAmount"] === "" ? 0 : parseFloat(data["TotalAmount"])) /
          ((data["Quantity"] === "" ? 0 : parseFloat(data["Quantity"])) +
            (data["BonusQty"] === "" ? 0 : parseFloat(data["BonusQty"])))
      ).toFixed(2);
    }

    // console.log("data calculationManyFields: ", data);

    return data;
  };

  const calculationMasterFields = (list) => {
    console.log("list: ", list);
    let SumSubTotalAmount = 0;
    let SumVatAmount = 0;
    let SumDiscountAmount = 0;
    // let SumCommission = 0;
    let SumTotalAmount = 0;

    list.forEach((row, i) => {
      console.log("row: ", row);
      SumSubTotalAmount +=
        row.SubTotalAmount === "" || row.SubTotalAmount === null
          ? 0
          : parseFloat(row.SubTotalAmount);
      SumVatAmount +=
        row.VatAmount === "" || row.VatAmount === null
          ? 0
          : parseFloat(row.VatAmount);
      SumDiscountAmount +=
        row.DiscountAmount === "" || row.DiscountAmount === null
          ? 0
          : parseFloat(row.DiscountAmount);
      SumTotalAmount +=
        row.TotalAmount === "" || row.TotalAmount === null
          ? 0
          : parseFloat(row.TotalAmount);
    });

    let data = { ...currentInvoice };
    data["SumSubTotalAmount"] = SumSubTotalAmount.toFixed(2);
    data["SumVatAmount"] = SumVatAmount.toFixed(2);
    data["SumDiscountAmount"] = SumDiscountAmount.toFixed(2);
    data["SumTotalAmount"] = SumTotalAmount.toFixed(0);

    // SumCommission =
    //   (data["SumCommission"] === "" || data["SumCommission"] === null) ? 0 : parseFloat(data["SumCommission"]);

    data["NetPaymentAmount"] = (
      (data["SumTotalAmount"] === "" || data["SumTotalAmount"] === null
        ? 0
        : parseFloat(data["SumTotalAmount"])) -
      (data["SumCommission"] === "" || data["SumCommission"] === null
        ? 0
        : parseFloat(data["SumCommission"]))
    ).toFixed(0);
    console.log("data: ", data);

    setCurrentInvoice(data);
  };

  const addEditManyItem = () => {
    if (validateFormMany()) {
      // console.log("currentMany: ", currentMany);
      // console.log("data.TransactionItemsId: ", currentMany.TransactionItemsId);

      let isExist = 0;
      manyDataList.forEach((row, i) => {
        if (currentMany.ProductId === row.ProductId && isExist === 0) {
          isExist = 1;
        }
      });

      if (isExist === 1) {
        props.openNoticeModal({
          isOpen: true,
          msg: "Already added this product",
          msgtype: 0,
        });

        return;
      }

      let rows = [];
      var selectedProduct = productList.filter(
        (prod) => prod.id === currentMany.ProductId
      );

      // console.log('selectedProduct: ', selectedProduct);

      // console.log("oldManyDataList: ", manyDataList);

      manyDataList.forEach((row, i) => {
        let newRow = {};

        newRow.autoId = row.autoId; //Just unique id for delete/update
        newRow.TransactionItemsId = row.TransactionItemsId;
        newRow.TransactionId = row.TransactionId;
        newRow.ProductId = row.ProductId;
        newRow.ProductName = row.ProductName;
        newRow.Quantity = row.Quantity;
        newRow.TradePrice = row.TradePrice;
        newRow.MRP = row.MRP;
        newRow.OrderQty = row.OrderQty;
        newRow.BonusQty = row.BonusQty;
        newRow.MfgDate = row.MfgDate;
        newRow.ExpDate = row.ExpDate;
        newRow.VatonTrade = row.VatonTrade;
        newRow.VatAmount = row.VatAmount;
        newRow.DiscountPercentage = row.DiscountPercentage;
        newRow.DiscountAmount = row.DiscountAmount;
        newRow.SubTotalAmount = row.SubTotalAmount;
        newRow.NewCost = row.NewCost;
        newRow.Commission = row.Commission;
        newRow.TotalAmount = row.TotalAmount;
        rows.push(newRow);
      });

      let newRow = {};
      newRow.autoId = currentMany.ProductId + moment().milliseconds(); //Just unique id for delete/update
      newRow.TransactionItemsId = currentMany.TransactionItemsId;
      newRow.TransactionId = currentMany.TransactionId;
      newRow.ProductId = currentMany.ProductId;
      newRow.ProductName = selectedProduct[0].name;
      newRow.Quantity = currentMany.Quantity;
      newRow.BonusQty = currentMany.BonusQty;
      newRow.TradePrice = currentMany.TradePrice;
      newRow.VatonTrade = currentMany.VatonTrade;
      newRow.MRP = currentMany.MRP;
      newRow.OrderQty = currentMany.OrderQty;
      newRow.MfgDate = currentMany.MfgDate;
      newRow.ExpDate = currentMany.ExpDate;
      newRow.VatAmount = currentMany.VatAmount;
      newRow.DiscountPercentage = currentMany.DiscountPercentage;
      newRow.DiscountAmount = currentMany.DiscountAmount;
      newRow.SubTotalAmount = currentMany.SubTotalAmount;
      newRow.NewCost = currentMany.NewCost;
      newRow.Commission = currentMany.Commission;
      newRow.TotalAmount = currentMany.TotalAmount;
      rows.push(newRow);

      setManyDataList(rows);
      // console.log("manyDataList: ", rows);
      calculationMasterFields(rows);

      resetMany();
    }
  };

  const validateFormMaster = () => {
    let validateFields = ["TransactionDate", "SupplierId", "InvoiceNo"];
    let errorData = {};
    let isValid = true;
    validateFields.map((field) => {
      if (!currentInvoice[field]) {
        errorData[field] = "validation-style";
        isValid = false;
      }
    });
    setErrorObjectMaster(errorData);
    return isValid;
  };

  const validateFormMany = () => {
    let validateFields = [
      "ProductId",
      "Quantity",
      "SubTotalAmount",
      "TotalAmount",
    ];
    let errorData = {};
    let isValid = true;
    validateFields.map((field) => {
      if (!currentMany[field]) {
        errorData[field] = "validation-style";
        isValid = false;
      }
    });
    setErrorObjectMany(errorData);
    return isValid;
  };

  const manyColumnList = [
    { field: "rownumber", label: "SL", align: "center", width: "3%" },
    // { field: 'SL', label: 'SL',width:'10%',align:'center',visible:true,sort:false,filter:false },
    {
      field: "ProductName",
      label: "Product",
      // width: "10%",
      align: "left",
      visible: true,
      // sort: true,
      // filter: false,
    },
    {
      field: "TradePrice",
      label: "T_Price",
      width: "4%",
      align: "right",
      type: "number",
      visible: true,
      // sort: true,
      // filter: true,
    },
    {
      field: "OrderQty",
      label: "O_Qnty",
      align: "right",
      width: "5%",
      visible: true,
      // sort: true,
      // filter: true,
    },
    {
      field: "Quantity",
      label: "R_Qnty",
      width: "5%",
      align: "right",
      visible: true,
      // sort: true,
      // filter: true,
    },
    {
      field: "BonusQty",
      label: "B_Qnty",
      width: "5%",
      align: "right",
      visible: true,
      // sort: true,
      // filter: true,
    },
    {
      field: "SubTotalAmount",
      label: "S_Total",
      width: "5%",
      align: "right",
      type: "number",
      visible: true,
      // sort: true,
      // filter: true,
    },
    {
      field: "VatonTrade",
      label: "VAT (%)",
      width: "4%",
      align: "right",
      visible: true,
      // sort: true,
      // filter: true,
    },
    {
      field: "VatAmount",
      label: "VAT (Amt)",
      width: "5%",
      align: "right",
      type: "number",
      visible: true,
      // sort: true,
      // filter: true,
    },
    {
      field: "DiscountAmount",
      label: "Dis (Amt)",
      width: "5%",
      align: "right",
      type: "number",
      visible: true,
      // sort: true,
      // filter: true,
    },
    {
      field: "NewCost",
      label: "New Cost",
      width: "5%",
      align: "right",
      visible: true,
      // sort: true,
      // filter: true,
    },
    {
      field: "MRP",
      label: "MRP",
      width: "4%",
      align: "right",
      type: "number",
      visible: true,
      // sort: true,
      // filter: true,
    },
    {
      field: "MfgDate",
      label: "Mfg. Date",
      width: "5%",
      align: "left",
      visible: true,
      // sort: true,
      // filter: true,
    },
    {
      field: "ExpDate",
      label: "Exp. Date",
      width: "5%",
      align: "left",
      visible: true,
      // sort: true,
      // filter: true,
    },
    {
      field: "TotalAmount",
      label: "Total",
      width: "5%",
      align: "right",
      type: "number",
      visible: true,
      // sort: true,
      // filter: true,
    },
    /*
    {
      field: "Commission",
      label: "Com (Amt)",
      width: "5%",
      align: "right",
      visible: true,
      // sort: true,
      // filter: true,
    },*/
    {
      field: "custom",
      label: "Action",
      width: "4%",
      align: "center",
      visible: true,
      // sort: false,
      // filter: false,
    },
  ];

  /** Action from table row buttons*/
  function actioncontrol(rowData) {
    return (
      <>
        {!currentInvoice.BPosted && (
          <DeleteOutline
            className={"table-delete-icon"}
            onClick={() => {
              deleteDataMany(rowData);
            }}
          />
        )}
      </>
    );
  }

  const deleteDataMany = (rowData) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this data!",
      icon: "warning",
      buttons: {
        confirm: {
          text: "Yes",
          value: true,
          visible: true,
          className: "",
          closeModal: true,
        },
        cancel: {
          text: "No",
          value: null,
          visible: true,
          className: "",
          closeModal: true,
        },
      },
      dangerMode: true,
    }).then((allowAction) => {
      if (allowAction) {
        deleteInvoiceItem(rowData);
      }
    });
  };

  function deleteInvoiceItem(rowData) {
    // console.log("manyDataList: ", manyDataList);
    // console.log("rowData for delete: ", rowData);

    let data = manyDataList.filter(function (obj) {
      return obj.autoId !== rowData.autoId;
    });

    setManyDataList(data);

    let delItems = [...deletedItems];
    delItems.push(rowData);
    console.log("delItems: ", delItems);

    setDeletedItems(delItems);
  }

  const postInvoice = () => {
    swal({
      title: "Are you sure?",
      text: "Do you really want to post the stock?",
      icon: "warning",
      buttons: {
        confirm: {
          text: "Yes",
          value: true,
          visible: true,
          className: "",
          closeModal: true,
        },
        cancel: {
          text: "No",
          value: null,
          visible: true,
          className: "",
          closeModal: true,
        },
      },
      dangerMode: true,
    }).then((allowAction) => {
      if (allowAction) {
        let cInvoiceMaster = { ...currentInvoice };
        cInvoiceMaster["BPosted"] = 1;

        let params = {
          action: "dataAddEdit",
          lan: language(),
          UserId: UserInfo.UserId,
          ClientId: UserInfo.ClientId,
          BranchId: UserInfo.BranchId,
          InvoiceMaster: cInvoiceMaster,
          InvoiceItems: manyDataList,
          DeletedItems: deletedItems,
        };

        addEditAPICall(params);
      } else {
      }
    });
  };

  function saveData(p) {
    let params = {
      action: "dataAddEdit",
      lan: language(),
      UserId: UserInfo.UserId,
      ClientId: UserInfo.ClientId,
      BranchId: UserInfo.BranchId,
      InvoiceMaster: currentInvoice,
      InvoiceItems: manyDataList,
      DeletedItems: deletedItems,
    };

    addEditAPICall(params);
  }

  function addEditAPICall(params) {
    if (validateFormMaster()) {
      apiCall.post(serverpage, { params }, apiOption()).then((res) => {
        // console.log('res: ', res);

        props.openNoticeModal({
          isOpen: true,
          msg: res.data.message,
          msgtype: res.data.success,
        });

        // console.log('currentInvoice: ', currentInvoice);
        if (currentInvoice.id === "") {
          //New
          getDataSingleFromServer(res.data.id);
        } else {
          //Edit
          getDataSingleFromServer(currentInvoice.id);
        }

        /**after save refresh the master list */
        // getDataList(); //invoice list
        // getDataSingleFromServer(res.data.id);

        // console.log('props modal: ', props);
        // if (res.data.success === 1) {
        //   props.modalCallback("addedit");
        // }
      });
    }
  }

  return (
    <>
      <div class="bodyContainer">
        <div class="topHeader">
          <h3>
            Home ❯ Data Collection ❯ গ্রুপের তথ্য সংগ্রহ (PG data collection)
          </h3>
        </div>

        {listEditPanelToggle && (
          <>
            {/* <!-- TABLE SEARCH AND GROUP ADD --> */}
            <div class="searchAdd">
              {/* <input type="text" placeholder="Search Product Group"/> */}
              <label></label>

              {/* <Button label={"ADD"} class={"btnAdd"} onClick={addData} /> */}
              <Button label={"ADD"} class={"btnAdd"} onClick={addData} />
            </div>

            {/* <!-- ####---Master invoice list---####s --> */}
            {/* <div class="subContainer">
              <div className="App">
                <CustomTable
                  columns={masterColumnList}
                  rows={dataList ? dataList : {}}
                  actioncontrol={actioncontrolmaster}
                />
              </div>
            </div> */}
          </>
        )}

        {!listEditPanelToggle && (
          <>
            {/* <!-- ##########-----PRODUCT RECEIVED INPUT AREA----############  --> */}
            {!currentInvoice.BPosted && (
              <div class="subContainer inputArea">
                {/* <!-- INPUR AREA PARTITION-1 INSERTION AREA --> */}

                <div class="text-center">
                  <h2>গ্রুপের তথ্য সংগ্রহ ফরম (PG data collection form)</h2>
                  {/* <h2 className="subheader">
                        Welcome LSP1 Savar, আপনার নির্ধারিত এলাকা (Your assigned area): Savar
                      </h2> */}
                </div>

                <div
                  class="input-areaPartition grid-container"
                  id="areaPartion-x"
                >
                  <div class="marginBottom text-center">
                    <h4>
                      ত্রৈমাসিক তথ্য সংগ্রহ এবং সংরক্ষণ (Quarterly Data
                      Collection and Storage)
                    </h4>
                  </div>

                  <div class="formControl">
                    <label>তথ্য সংগ্রহ বছর (Year):</label>
                    <Autocomplete
                      autoHighlight
                      // freeSolo
                      className="chosen_dropdown"
                      id="YearId"
                      name="YearId"
                      autoComplete
                      options={yearList ? yearList : []}
                      getOptionLabel={(option) => option.name}
                      // value={selectedSupplier}
                      value={
                        yearList
                          ? yearList[
                            yearList.findIndex(
                                (list) => list.id == currentMany.YearId
                              )
                            ]
                          : null
                      }
                      onChange={(event, valueobj) =>
                        handleChangeChoosenMany(
                          "YearId",
                          valueobj ? valueobj.id : ""
                        )
                      }
                      renderOption={(option) => (
                        <Typography className="chosen_dropdown_font">
                          {option.name}
                        </Typography>
                      )}
                      renderInput={(params) => (
                        <TextField {...params} variant="standard" fullWidth />
                      )}
                    />
                  </div>

                  <div class="formControl">
                    <label>তথ্য সংগ্রহ ত্রৈমাসিক (Quarter):</label>
                    <Autocomplete
                      autoHighlight
                      // freeSolo
                      className="chosen_dropdown"
                      id="QuarterId"
                      name="QuarterId"
                      autoComplete
                      options={quarterList ? quarterList : []}
                      getOptionLabel={(option) => option.name}
                      // value={selectedSupplier}
                      value={
                        quarterList
                          ? quarterList[
                            quarterList.findIndex(
                                (list) => list.id == currentMany.QuarterId
                              )
                            ]
                          : null
                      }
                      onChange={(event, valueobj) =>
                        handleChangeChoosenMany(
                          "QuarterId",
                          valueobj ? valueobj.id : ""
                        )
                      }
                      renderOption={(option) => (
                        <Typography className="chosen_dropdown_font">
                          {option.name}
                        </Typography>
                      )}
                      renderInput={(params) => (
                        <TextField {...params} variant="standard" fullWidth />
                      )}
                    />
                  </div>

                  <div class="formControl">
                    <label>পিজি গ্রুপ (PG Group):</label>
                    <Autocomplete
                      autoHighlight
                      // freeSolo
                      className="chosen_dropdown"
                      id="PgGroupId"
                      name="PgGroupId"
                      autoComplete
                      options={PgGroupList ? PgGroupList : []}
                      getOptionLabel={(option) => option.name}
                      // value={selectedSupplier}
                      value={
                        PgGroupList
                          ? PgGroupList[
                            PgGroupList.findIndex(
                                (list) => list.id == currentMany.PgGroupId
                              )
                            ]
                          : null
                      }
                      onChange={(event, valueobj) =>
                        handleChangeChoosenMany(
                          "PgGroupId",
                          valueobj ? valueobj.id : ""
                        )
                      }
                      renderOption={(option) => (
                        <Typography className="chosen_dropdown_font">
                          {option.name}
                        </Typography>
                      )}
                      renderInput={(params) => (
                        <TextField {...params} variant="standard" fullWidth />
                      )}
                    />
                  </div>

                  <div class="formControl">
                    <label>BQ1. দলের নাম (Group name):</label>
                    <input
                      type="text"
                      id="groupName"
                      name="groupName"
                      // class={errorObject.groupName}
                      value={currentMany.groupName}
                      onChange={(e) => handleChangeMany(e)}
                    />
                  </div>

                  <div class="formControl">
                    <label>BQ2. দলের প্রকারঃ (Value Chain):</label>
                    <input
                      type="text"
                      id="valueChain"
                      name="valueChain"
                      // class={errorObject.valueChain}
                      value={currentMany.valueChain}
                      onChange={(e) => handleChangeMany(e)}
                    />
                  </div>

                  <div class="formControl">
                    <label>BQ3. দলের আই,ডিঃ ( Group identity code):</label>
                    <input
                      type="text"
                      id="groupIdentityCode"
                      name="groupIdentityCode"
                      // class={errorObject.groupIdentityCode}
                      value={currentMany.groupIdentityCode}
                      onChange={(e) => handleChangeMany(e)}
                    />
                  </div>


                  
                  <div class="formControl">
                    <label>BQ4. পিজি এর সদস্য সংখ্যা (Number of PG members)</label>
                  </div>

                  <div class="formControl">
                    <label>পুরুষ / Male:</label>
                    <input
                        type="number"
                        id="maleMembers"
                        name="maleMembers"
                        // class={errorObject.groupIdentityCode}
                        value={currentMany.maleMembers}
                        onChange={(e) => handleChangeMany(e)}
                      />
                  </div>

                  <div class="formControl">
                    <label>নারী/Female:</label>
                    <input
                        type="number"
                        id="femaleMembers"
                        name="femaleMembers"
                        // class={errorObject.groupIdentityCode}
                        value={currentMany.femaleMembers}
                        onChange={(e) => handleChangeMany(e)}
                      />
                  </div>

                  <div class="formControl">
                    <label>ট্রান্সজেন্ডার /Transgender:</label>
                    <input
                        type="number"
                        id="transgenderMembers"
                        name="transgenderMembers"
                        // class={errorObject.groupIdentityCode}
                        value={currentMany.transgenderMembers}
                        onChange={(e) => handleChangeMany(e)}
                      />
                  </div>


                  <div class="formControl">
                    <label>BQ5. পিজি গঠনের তারিখ (Date of the PG formation):</label>
                    <input
                        type="date"
                        id="pgFormationDate"
                        name="pgFormationDate"
                        // class={errorObject.pgFormationDate}
                        value={currentMany.pgFormationDate}
                        onChange={(e) => handleChangeMany(e)}
                      />
                  </div>

                  <div class="formControl">
                    <label>BQ6. গ্রাম/ওয়ার্ডঃ (Village/Ward):</label>
                    <input
                        type="text"
                        id="villageWard"
                        name="villageWard"
                        // class={errorObject.groupIdentityCode}
                        value={currentMany.villageWard}
                        onChange={(e) => handleChangeMany(e)}
                      />
                  </div>

                  <div class="formControl">
                    <label>BQ7. ইউনিয়ন/পৌরসভাঃ (Union/ Municipality):</label>
                    <input
                        type="text"
                        id="unionMunicipality"
                        name="unionMunicipality"
                        // class={errorObject.groupIdentityCode}
                        value={currentMany.unionMunicipality}
                        onChange={(e) => handleChangeMany(e)}
                      />
                  </div>

                 
                  <div class="formControl">
                    <label>MQ1. পিজি কি নিবন্ধিত? (Is the PG registered):</label>
                    <div className="radio-group">
                      <label className="radio-label">
                        <input
                          type="radio"
                          id="pgRegisteredYes"
                          name="pgRegistered"
                          value="Yes"
                          checked={currentMany.pgRegistered === "Yes"}
                          onChange={(e) => handleChangeMany(e)}
                        />
                        Yes
                      </label>

                      <label className="radio-label">
                        <input
                          type="radio"
                          id="pgRegisteredNo"
                          name="pgRegistered"
                          value="No"
                          checked={currentMany.pgRegistered === "No"}
                          onChange={(e) => handleChangeMany(e)}
                        />
                        No
                      </label>
                    </div>
                  </div>

                  <div class="formControl">
                    <label>MQ2. এই পিজির কি দৃশ্যমান জায়গায় সাইনবোর্ড আছে? (Does
                        this have a signboard in a visible place?):</label>
                        <div className="radio-group">
                      <label className="radio-label">
                        <input
                          type="radio"
                          id="signboardYes"
                          name="signboard"
                          value="Yes"
                          checked={currentMany.signboard === "Yes"}
                          onChange={(e) => handleChangeMany(e)}
                        />
                        Yes
                      </label>

                      <label className="radio-label">
                        <input
                          type="radio"
                          id="signboardNo"
                          name="signboard"
                          value="No"
                          checked={currentMany.signboard === "No"}
                          onChange={(e) => handleChangeMany(e)}
                        />
                        No
                      </label>
                    </div>
                  </div>

                  
                  <div class="formControl">
                    <label>MQ3. পিজি এর কি স্থায়ী অফিস আছে? (Does this PG have a
                        permanent office?):</label>
                        <div className="radio-group">
                      <label className="radio-label">
                        <input
                          type="radio"
                          id="permanentOfficeYes"
                          name="permanentOffice"
                          value="Yes"
                          checked={currentMany.permanentOffice === "Yes"}
                          onChange={(e) => handleChangeMany(e)}
                        />
                        Yes
                      </label>

                      <label className="radio-label">
                        <input
                          type="radio"
                          id="permanentOfficeNo"
                          name="permanentOffice"
                          value="No"
                          checked={currentMany.permanentOffice === "No"}
                          onChange={(e) => handleChangeMany(e)}
                        />
                        No
                      </label>
                    </div>
                  </div>
                 


                  <div class="formControl">
                    <label> MQ4. নিচের কোন অফিস সরঞ্জামাদি LDDP থেকে পেয়েছেন?
                        (Which of the following main office equipment the PG
                        have received from LDDP?):</label>
                        <div>
                      <div class="checkbox-label">
                        <input
                          type="checkbox"
                          id="equipmentComputer"
                          name="equipmentComputer"
                          value="Computer / Laptop / Printer"
                        />
                        <label for="equipmentComputer">
                          কম্পিউটার / ল্যাপটপ/প্রিন্টার
                        </label>
                      </div>

                      <div class="checkbox-label">
                        <input
                          type="checkbox"
                          id="equipmentTableChair"
                          name="equipmentTableChair"
                          value="Table and Chair"
                        />
                        <label for="equipmentTableChair">টেবিল চেয়ার</label>
                      </div>

                      <div class="checkbox-label">
                        <input
                          type="checkbox"
                          id="equipmentCabinet"
                          name="equipmentCabinet"
                          value="Almirah / File Cabinet"
                        />
                        <label for="equipmentCabinet">
                          আলমারি / ফাইল কেবিনেট
                        </label>
                      </div>

                      <div class="checkbox-label">
                        <input
                          type="checkbox"
                          id="equipmentOther"
                          name="equipmentOther"
                          value="Other"
                        />
                        <label for="equipmentOther">
                          অন্যান্য (উল্লেখ করুন)
                        </label>
                      </div>
                    </div>
                  </div>
                 
                

                  
                  <div class="formControl">
                    <label>MQ6. পিজি এর কি নির্বাহী কমিটি আছে? (Does this PG have
                        an executive committee?):</label>
                        <div className="radio-group">
                      <label className="radio-label">
                        <input
                          type="radio"
                          id="executiveCommitteeYes"
                          name="executiveCommittee"
                          value="Yes"
                          checked={currentMany.executiveCommittee === "Yes"}
                          onChange={(e) => handleChangeMany(e)}
                        />
                        Yes
                      </label>

                      <label className="radio-label">
                        <input
                          type="radio"
                          id="executiveCommitteeNo"
                          name="executiveCommittee"
                          value="No"
                          checked={currentMany.executiveCommittee === "No"}
                          onChange={(e) => handleChangeMany(e)}
                        />
                        No
                      </label>
                    </div>
                  </div>

                 
                 
                  <div class="formControl">
                    <label>MQ9. পিজি মিটিং কি নিয়মিত হয়? (Does PG meeting held on
                        a regular basis?):</label>
                        <div className="radio-group">
                      <label className="radio-label">
                        <input
                          type="radio"
                          id="meetingRegularYes"
                          name="meetingRegular"
                          value="Yes"
                          checked={currentMany.meetingRegular === "Yes"}
                          onChange={(e) => handleChangeMany(e)}
                        />
                        Yes
                      </label>

                      <label className="radio-label">
                        <input
                          type="radio"
                          id="meetingRegularNo"
                          name="meetingRegular"
                          value="No"
                          checked={currentMany.meetingRegular === "No"}
                          onChange={(e) => handleChangeMany(e)}
                        />
                        No
                      </label>
                    </div>
                  </div>

                 
                  
                  <div class="formControl">
                    <label>MQ10. সর্বশেষ মিটিং এ কতজন সদস্য উপস্থিত ছিল? (How many
                        members attended the last meeting?):</label>
                        <input
                        type="number"
                        id="lastMeetingMembers"
                        name="lastMeetingMembers"
                        // class={errorObject.groupIdentityCode}
                        value={currentMany.lastMeetingMembers}
                        onChange={(e) => handleChangeMany(e)}
                      />
                  </div>


                  <div class="formControl">
                    <label> MQ15. পিজির সদস্যদের কি সঞ্চয় পাস বই আছে? (Do the
                        members of this PG have a savings passbook?):</label>
                        <div className="radio-group">
                      <label className="radio-label">
                        <input
                          type="radio"
                          id="savingsPassbookYes"
                          name="savingsPassbook"
                          value="Yes"
                          checked={currentMany.savingsPassbook === "Yes"}
                          onChange={(e) => handleChangeMany(e)}
                        />
                        Yes
                      </label>

                      <label className="radio-label">
                        <input
                          type="radio"
                          id="savingsPassbookNo"
                          name="savingsPassbook"
                          value="No"
                          checked={currentMany.savingsPassbook === "No"}
                          onChange={(e) => handleChangeMany(e)}
                        />
                        No
                      </label>
                    </div>
                  </div>


                
                  <div class="formControl">
                    <label> MQ16. মাসিক সঞ্চয়ের হার কত টাকা? (What is the rate of
                        monthly savings in taka?):</label>
                        
                        <input
                        type="text"
                        id="monthlySavingsRate"
                        name="monthlySavingsRate"
                        // class={errorObject.groupIdentityCode}
                        value={currentMany.monthlySavingsRate}
                        onChange={(e) => handleChangeMany(e)}
                      />
                  </div>

                  <div class="formControl">
                    <label> মন্তব্য (Remarks):</label>
                        
                    <input
                        type="text"
                        id="remarks"
                        name="remarks"
                        // class={errorObject.groupIdentityCode}
                        value={currentMany.remarks}
                        onChange={(e) => handleChangeMany(e)}
                      />
                  </div>

                  <div class="formControl">
                    <label> তথ্য সংগ্রহকারীর নাম: (Name of data collector):</label>
                        
                    <input
                        type="text"
                        id="dataCollectorName"
                        name="dataCollectorName"
                        // class={errorObject.groupIdentityCode}
                        value={currentMany.dataCollectorName}
                        onChange={(e) => handleChangeMany(e)}
                      />
                  </div>


                  <div class="formControl">
                    <label> তথ্য সংগ্রহের তারিখঃ (Date of data collection):</label>
                        
                    <input
                        type="date"
                        id="dataCollectionDate"
                        name="dataCollectionDate"
                        // class={errorObject.dataCollectionDate}
                        value={currentMany.dataCollectionDate}
                        onChange={(e) => handleChangeMany(e)}
                      />
                  </div>

                
                
                    <div class="btnAddForm">
                      <Button
                        label={"সংরক্ষণ করুন (Save)"}
                        class={"btnAddCustom"}
                        onClick={addEditManyItem}
                      />

                      <Button
                        label={"ফেরত যান (Back To List)"}
                        class={"btnBackCustom"}
                        onClick={backToList}
                      />

                    </div>
                 



                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default PGDataCollection;
