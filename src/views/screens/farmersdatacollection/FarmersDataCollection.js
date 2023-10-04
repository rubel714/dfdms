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

const FarmersDataCollection = (props) => {
  const serverpage = "farmersdatacollection"; // this is .php server page

  const { useState } = React;
  const [bFirst, setBFirst] = useState(true);
  const [listEditPanelToggle, setListEditPanelToggle] = useState(true); //when true then show list, when false then show add/edit
  const [supplierList, setSupplierList] = useState(null);
  const [productList, setProductList] = useState(null);
  const [pgGroupList, setPgGroupList] = useState(null);
  const [quarterList, setQuarterList] = useState(null);
  const [yearList, setYearList] = useState(null);



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
      PGId: "",
    });
  }

  /**Get data for table list */
  function getDataList() {
    let params = {
      action: "getDataList",
      lan: language(),
      UserId: UserInfo.UserId,
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

    getPgGroupList();
    getQuarterList();
    getYearList();

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
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setProductList(
        [{ id: "", name: "Select product" }].concat(res.data.datalist)
      );
    });
  }

  function getPgGroupList() {
    let params = {
      action: "PgGroupList",
      lan: language(),
      UserId: UserInfo.UserId,
      DivisionId: 1,
      DistrictId: 1,
      UpazilaId: 1
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setPgGroupList(
        [{ id: "", name: "পিজি গ্রুপ নির্বাচন করুন" }].concat(res.data.datalist)
      );
    });
  }

  function getQuarterList() {
    let params = {
      action: "QuarterList",
      lan: language(),
      UserId: UserInfo.UserId
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setQuarterList(
        [{ id: "", name: "ত্রৈমাসিক নির্বাচন করুন" }].concat(res.data.datalist)
      );
    });
  }

  function getYearList() {
    let params = {
      action: "YearList",
      lan: language(),
      UserId: UserInfo.UserId
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setYearList(
        [{ id: "", name: "বছর নির্বাচন করুন" }].concat(res.data.datalist)
      );
    });
  }

  const masterColumnList = [
    { field: "rownumber", label: "SL", align: "center", width: "5%" },
    // { field: 'SL', label: 'SL',width:'10%',align:'center',visible:true,sort:false,filter:false },
    {
      field: "DataTypeName",
      label: "Data Type Name",
      width: "10%",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
    },
    {
      field: "DataTypeName",
      label: "Data Type Name",
      width: "15%",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
    },
    {
      field: "DataTypeName",
      label: "Data Type Name",
      align: "left",
      // width: "30%",
      visible: true,
      sort: true,
      filter: true,
    },
    {
      field: "DataTypeName",
      label: "Data Type Name",
      width: "10%",
      align: "left",
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
  ];

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
          <h4>
            Home ❯ Data Collection ❯ খামারীর তথ্য (Farmers Data Collection)
          </h4>
        </div>

        {listEditPanelToggle && (
          <>
            {/* <!-- TABLE SEARCH AND GROUP ADD --> */}
            <div class="searchAdd">
              {/* <input type="text" placeholder="Search Product Group"/> */}
              <label></label>

              {/* <Button label={"ADD"} class={"btnAdd"} onClick={addData} /> */}
              <Button label={"Enter Data"} class={"btnAdd"} onClick={addData} />
            </div>

            {/* <!-- ####---Master invoice list---####s --> */}
             <div class="subContainer">
              <div className="App">
                <CustomTable
                  columns={masterColumnList}
                  rows={dataList ? dataList : {}}
                  actioncontrol={actioncontrolmaster}
                />
              </div>
            </div> 
          </>
        )}

        {!listEditPanelToggle && (
          <>
            {/* <!-- ##########-----PRODUCT RECEIVED INPUT AREA----############  --> */}
            {!currentInvoice.BPosted && (
              <div class="subContainer inputArea">
                {/* <!-- INPUR AREA PARTITION-1 INSERTION AREA --> */}

                <div class="text-center">
                  <h2>খামারীর তথ্য ফরম (Farmers Data Collection Form)</h2>
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
                    <label>General Information</label>
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
                      id="PGId"
                      name="PGId"
                      autoComplete
                      options={pgGroupList ? pgGroupList : []}
                      getOptionLabel={(option) => option.name}
                      // value={selectedSupplier}
                      value={
                        pgGroupList
                          ? pgGroupList[
                            pgGroupList.findIndex(
                                (list) => list.id == currentMany.PGId
                              )
                            ]
                          : null
                      }
                      onChange={(event, valueobj) =>
                        handleChangeChoosenMany(
                          "PGId",
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
                    <label>BQ1. দলের নাম ও প্রকারঃ (Group name and Value Chain):</label>
                    <input
                      type="text"
                      id="BQ1"
                      name="BQ1"
                      value={currentMany.BQ1}
                      onChange={(e) => handleChangeMany(e)}
                    />
                  </div>

                  <div class="formControl">
                    <label>BQ2. খামারীর নামঃ (Name of Farmer):</label>
                    <input
                      type="text"
                      id="BQ2"
                      name="BQ2"
                      value={currentMany.BQ2}
                      onChange={(e) => handleChangeMany(e)}
                    />
                  </div>

                  <div class="formControl">
                    <label>BQ3. জাতীয় পরিচয়পত্র নম্বরঃ (National ID number):</label>
                    <input
                      type="text"
                      id="BQ3"
                      name="BQ3"
                      value={currentMany.BQ3}
                      onChange={(e) => handleChangeMany(e)}
                    />
                  </div>

                  <div class="formControl">
                    <label>BQ4. প্রজেক্ট প্রদত্ত আইডি নম্বরঃ (ID number):</label>
                    <input
                      type="text"
                      id="BQ4"
                      name="BQ4"
                      value={currentMany.BQ4}
                      onChange={(e) => handleChangeMany(e)}
                    />
                  </div>

                  <div class="formControl">
                    <label>BQ5. মোবাইল ফোন নম্বরঃ (Phone number):</label>
                    <input
                      type="text"
                      id="BQ5"
                      name="BQ5"
                      value={currentMany.BQ5}
                      onChange={(e) => handleChangeMany(e)}
                    />
                  </div>

                  <div class="formControl">
                    <label>BQ6. জন্ম তারিখঃ (Date of birth):</label>
                    <input
                      type="date"
                      id="BQ6"
                      name="BQ6"
                      value={currentMany.BQ6}
                      onChange={(e) => handleChangeMany(e)}
                    />
                  </div>

                  <div class="formControl">
                    <label>BQ7. বয়সঃ (Age of farmer):</label>
                    <input
                      type="number"
                      id="BQ7"
                      name="BQ7"
                      value={currentMany.BQ7}
                      onChange={(e) => handleChangeMany(e)}
                    />
                  </div>

                  <div class="formControl">
                    <label>BQ8. বাবার নামঃ (Fathers Name):</label>
                    <input
                      type="text"
                      id="BQ8"
                      name="BQ8"
                      value={currentMany.BQ8}
                      onChange={(e) => handleChangeMany(e)}
                    />
                  </div>

                  <div class="formControl">
                    <label>BQ9. মায়ের নামঃ (Mothers Name):</label>
                    <input
                      type="text"
                      id="BQ9"
                      name="BQ9"
                      value={currentMany.BQ9}
                      onChange={(e) => handleChangeMany(e)}
                    />
                  </div>

                  <div class="formControl">
                    <label>BQ10. স্বামী/স্ত্রীর নামঃ (Spouse Name):</label>
                    <input
                      type="text"
                      id="BQ10"
                      name="BQ10"
                      value={currentMany.BQ10}
                      onChange={(e) => handleChangeMany(e)}
                    />
                  </div>

                  <div class="formControl">
                    <label>BQ11. গ্রাম/ওয়ার্ডঃ (Village Ward):</label>
                    <input
                      type="text"
                      id="BQ11"
                      name="BQ11"
                      value={currentMany.BQ11}
                      onChange={(e) => handleChangeMany(e)}
                    />
                  </div>

                  <div class="formControl">
                    <label>BQ12. ইউনিয়ন/পৌরসভাঃ (Union/ Municipality):</label>
                    <input
                      type="text"
                      id="BQ12"
                      name="BQ12"
                      value={currentMany.BQ12}
                      onChange={(e) => handleChangeMany(e)}
                    />
                  </div>

                  <div class="formControl">
                    <label>MQ1. পরিবারে (খানায়) মোট সদস্য সংখ্যাঃ (Number of members in the family):</label>
                    <input
                      type="number"
                      id="MQ1"
                      name="MQ1"
                      value={currentMany.MQ1}
                      onChange={(e) => handleChangeMany(e)}
                    />
                  </div>

                  <div class="formControl">
                    <label>MQ2. আপনি দলে কোন পদে আছেন? (Position in PG):</label>
                    <input
                      type="text"
                      id="MQ2"
                      name="MQ2"
                      value={currentMany.MQ2}
                      onChange={(e) => handleChangeMany(e)}
                    />
                  </div>

                  <div class="formControl">
                    <label>AOI: Productivity and Market sales</label>
                    
                  </div>
                  <div class="formControl">
                    <label>Value Chain: Goat</label>
                    
                  </div>

                  <div class="formControl">
                    <label>GQ1. প্রাপ্তবয়স্ক ছাগলের বর্তমান সংখ্যা কয়টি? (Number of goat at present):</label>
                    
                  </div>
                  
                  <div class="formControl">
                    <label>ব্লাক বেঙ্গল-পুরুষ/ Black Bengal Male:</label>
                    <input
                      type="number"
                      id="GQ1"
                      name="GQ1"
                      value={currentMany.GQ1}
                      onChange={(e) => handleChangeMany(e)}
                    />
                  </div>

                  <div class="formControl">
                    <label>ব্লাক বেঙ্গল-মাদি/Black Bengal Female:</label>
                    <input
                      type="number"
                      id="GQ1"
                      name="GQ1"
                      value={currentMany.GQ1}
                      onChange={(e) => handleChangeMany(e)}
                    />
                  </div>

                  <div class="formControl">
                    <label>অন্যান্য-পুরুষ/Others Male:</label>
                    <input
                      type="number"
                      id="GQ1"
                      name="GQ1"
                      value={currentMany.GQ1}
                      onChange={(e) => handleChangeMany(e)}
                    />
                  </div>

                  <div class="formControl">
                    <label>অন্যান্য-মাদি/ Others Female:</label>
                    <input
                      type="number"
                      id="GQ1"
                      name="GQ1"
                      value={currentMany.GQ1}
                      onChange={(e) => handleChangeMany(e)}
                    />
                  </div>
                  
                 

                  <div class="formControl">
                    <label>GQ2. ছাগলের বাচ্চার বর্তমান সংখ্যা কয়টি? (Number of goat kid at present):</label>
                    
                  </div>

                  <div class="formControl">
                    <label>ব্লাক বেঙ্গল-পুরুষ/ Black Bengal Male:</label>
                    <input
                      type="number"
                      id="GQ2"
                      name="GQ2"
                      value={currentMany.GQ2}
                      onChange={(e) => handleChangeMany(e)}
                    />
                  </div>

                  <div class="formControl">
                    <label>ব্লাক বেঙ্গল-মাদি/Black Bengal Female:</label>
                    <input
                      type="number"
                      id="GQ2"
                      name="GQ2"
                      value={currentMany.GQ2}
                      onChange={(e) => handleChangeMany(e)}
                    />
                  </div>

                  <div class="formControl">
                    <label>অন্যান্য-পুরুষ/Others Male:</label>
                    <input
                      type="number"
                      id="GQ2"
                      name="GQ2"
                      value={currentMany.GQ2}
                      onChange={(e) => handleChangeMany(e)}
                    />
                  </div>

                  <div class="formControl">
                    <label>অন্যান্য-মাদি/ Others Female:</label>
                    <input
                      type="number"
                      id="GQ2"
                      name="GQ2"
                      value={currentMany.GQ2}
                      onChange={(e) => handleChangeMany(e)}
                    />
                  </div>


                  <div class="formControl">
                    <label>GQ3. আপনি গত তিন মাসে কয়টি প্রাপ্তবয়স্ক ছাগল বিক্রি করেছেন? (How many ব্লাক বেঙ্গল-পুরুষ/Black Bengal Male
adult did you sale in last three months):</label>
                    
                  </div>

                  <div class="formControl">
                    <label>ব্লাক বেঙ্গল-পুরুষ/ Black Bengal Male:</label>
                    <input
                      type="number"
                      id="GQ3"
                      name="GQ3"
                      value={currentMany.GQ3}
                      onChange={(e) => handleChangeMany(e)}
                    />
                  </div>

                  <div class="formControl">
                    <label>ব্লাক বেঙ্গল-মাদি/Black Bengal Female:</label>
                    <input
                      type="number"
                      id="GQ3"
                      name="GQ3"
                      value={currentMany.GQ3}
                      onChange={(e) => handleChangeMany(e)}
                    />
                  </div>

                  <div class="formControl">
                    <label>অন্যান্য-পুরুষ/Others Male:</label>
                    <input
                      type="number"
                      id="GQ3"
                      name="GQ3"
                      value={currentMany.GQ3}
                      onChange={(e) => handleChangeMany(e)}
                    />
                  </div>

                  <div class="formControl">
                    <label>অন্যান্য-মাদি/ Others Female:</label>
                    <input
                      type="number"
                      id="GQ3"
                      name="GQ3"
                      value={currentMany.GQ3}
                      onChange={(e) => handleChangeMany(e)}
                    />
                  </div>

                  <div class="formControl">
                    <label>GQ4. গত তিন মাসে বিক্রি হওয়া প্রতিটি প্রাপ্তবয়স্ক জীবিত ছাগলের আনুমানিক ব্লাক বেঙ্গল-পুরুষ/Black Bengal Male
গড় ওজন কত কেজি ছিল? (Estimated average live weight of sold per adult goat):</label>
                    
                  </div>

                  <div class="formControl">
                    <label>ব্লাক বেঙ্গল-পুরুষ/ Black Bengal Male:</label>
                    <input
                      type="number"
                      id="GQ4"
                      name="GQ4"
                      value={currentMany.GQ4}
                      onChange={(e) => handleChangeMany(e)}
                    />
                  </div>

                  <div class="formControl">
                    <label>ব্লাক বেঙ্গল-মাদি/Black Bengal Female:</label>
                    <input
                      type="number"
                      id="GQ4"
                      name="GQ4"
                      value={currentMany.GQ4}
                      onChange={(e) => handleChangeMany(e)}
                    />
                  </div>

                  <div class="formControl">
                    <label>অন্যান্য-পুরুষ/Others Male:</label>
                    <input
                      type="number"
                      id="GQ4"
                      name="GQ4"
                      value={currentMany.GQ4}
                      onChange={(e) => handleChangeMany(e)}
                    />
                  </div>

                  <div class="formControl">
                    <label>অন্যান্য-মাদি/ Others Female:</label>
                    <input
                      type="number"
                      id="GQ4"
                      name="GQ4"
                      value={currentMany.GQ4}
                      onChange={(e) => handleChangeMany(e)}
                    />
                  </div>

                  <div class="formControl">
                    <label>GQ5. গত তিন মাসে বিক্রি হওয়া প্রতিটি ছাগলের আনুমানিক গড় মূল্য কত টাকাব্লাক বেঙ্গল-পুরুষ/Black Bengal Male
ছিল? (Estimated average price of sold per goat):</label>
                    <input
                      type="number"
                      id="GQ5"
                      name="GQ5"
                      value={currentMany.GQ5}
                      onChange={(e) => handleChangeMany(e)}
                    />
                  </div>

                  <div class="formControl">
                    <label>অন্যান্য প্রাণি/ পাখির সংখ্যা:</label>
                    <input
                      type="number"
                      id="GQ5"
                      name="GQ5"
                      value={currentMany.GQ5}
                      onChange={(e) => handleChangeMany(e)}
                    />
                  </div>

                  <div class="formControl">
                    <label>গাভী (Dairy cow):</label>
                    <input
                      type="number"
                      id="GQ5"
                      name="GQ5"
                      value={currentMany.GQ5}
                      onChange={(e) => handleChangeMany(e)}
                    />
                  </div>

                  <div class="formControl">
                    <label>মহিষ (Dairy buffalo):</label>
                    <input
                      type="number"
                      id="GQ5"
                      name="GQ5"
                      value={currentMany.GQ5}
                      onChange={(e) => handleChangeMany(e)}
                    />
                  </div>

                  <div class="formControl">
                    <label>বলদ / ষাড় (Beef fattening):</label>
                    <input
                      type="number"
                      id="GQ5"
                      name="GQ5"
                      value={currentMany.GQ5}
                      onChange={(e) => handleChangeMany(e)}
                    />
                  </div>
                  <div class="formControl">
                    <label>ছাগল (Goat):</label>
                    <input
                      type="number"
                      id="GQ5"
                      name="GQ5"
                      value={currentMany.GQ5}
                      onChange={(e) => handleChangeMany(e)}
                    />
                  </div>
                  <div class="formControl">
                    <label>ভেড়া (Sheep):</label>
                    <input
                      type="number"
                      id="GQ5"
                      name="GQ5"
                      value={currentMany.GQ5}
                      onChange={(e) => handleChangeMany(e)}
                    />
                  </div>
                  <div class="formControl">
                    <label>দেশী মুরগী (Chicken):</label>
                    <input
                      type="number"
                      id="GQ5"
                      name="GQ5"
                      value={currentMany.GQ5}
                      onChange={(e) => handleChangeMany(e)}
                    />
                  </div>
                  <div class="formControl">
                    <label>হাস (Duck):</label>
                    <input
                      type="number"
                      id="GQ5"
                      name="GQ5"
                      value={currentMany.GQ5}
                      onChange={(e) => handleChangeMany(e)}
                    />
                  </div>
                  <div class="formControl">
                    <label>কোয়েল (Quail):</label>
                    <input
                      type="number"
                      id="GQ5"
                      name="GQ5"
                      value={currentMany.GQ5}
                      onChange={(e) => handleChangeMany(e)}
                    />
                  </div>
                  <div class="formControl">
                    <label>ব্লাক বেঙ্গল-মাদি/Black Bengal Female:</label>
                    <input
                      type="number"
                      id="GQ5"
                      name="GQ5"
                      value={currentMany.GQ5}
                      onChange={(e) => handleChangeMany(e)}
                    />
                  </div>
                  <div class="formControl">
                    <label>অন্যান্য-পুরুষ/Others Male:</label>
                    <input
                      type="number"
                      id="GQ5"
                      name="GQ5"
                      value={currentMany.GQ5}
                      onChange={(e) => handleChangeMany(e)}
                    />
                  </div>
                  <div class="formControl">
                    <label>অন্যান্য-মাদি/ Others Female:</label>
                    <input
                      type="number"
                      id="GQ5"
                      name="GQ5"
                      value={currentMany.GQ5}
                      onChange={(e) => handleChangeMany(e)}
                    />
                  </div>
                  <div class="formControl">
                    <label>কবুতর (Pigeon):</label>
                    <input
                      type="number"
                      id="GQ5"
                      name="GQ5"
                      value={currentMany.GQ5}
                      onChange={(e) => handleChangeMany(e)}
                    />
                  </div>


                  <div class="formControl">
                    <label>Monitoring indicators</label>
                 
                  </div>

                  <div class="formControl">
                    <label>Q1. গত তিন মাসে ব্যবসায় দক্ষতা উন্নয়ন বিষয়ক কোন প্রশিক্ষন পেয়েছেন কি?
(Have you received any training on business skills development?):</label>
                    <div className="radio-group">
                      <label className="radio-label">
                        <input
                          type="radio"
                          id="Q1radioYes"
                          name="Q1radio"
                          value="Yes"
                          checked={currentMany.Q1radio === "Yes"}
                          onChange={(e) => handleChangeMany(e)}
                        />
                        Yes
                      </label>

                      <label className="radio-label">
                        <input
                          type="radio"
                          id="Q1radioNo"
                          name="Q1radio"
                          value="No"
                          checked={currentMany.Q1radio === "No"}
                          onChange={(e) => handleChangeMany(e)}
                        />
                        No
                      </label>
                    </div>
                  </div>


                  <div class="formControl">
                    <label>Q2. আপনি কি গত তিন মাসে আপনার গবাদিপ্রাণি ব্যবসা শুরু করতে /চালিয়ে হ্যাঁ না
যেতে LDDP/DLS থেকে কোনো সম্পদ পেয়েছেন? (Did you receive any asset from
LDDP/DLS to start/continue your livestock business):</label>
                    <div className="radio-group">
                      <label className="radio-label">
                        <input
                          type="radio"
                          id="Q2RadioYes"
                          name="Q2Radio"
                          value="Yes"
                          checked={currentMany.Q2Radio === "Yes"}
                          onChange={(e) => handleChangeMany(e)}
                        />
                        Yes
                      </label>

                      <label className="radio-label">
                        <input
                          type="radio"
                          id="Q2RadioNo"
                          name="Q2Radio"
                          value="No"
                          checked={currentMany.Q2Radio === "No"}
                          onChange={(e) => handleChangeMany(e)}
                        />
                        No
                      </label>
                    </div>
                  </div>


                  <div class="formControl">
                    <label>Q1. আপনি কি প্রয়োজন অনুযায়ী পশুচিকিৎসা এবং পরামর্শ সেবা পেয়েছেন?
(Do you have access to veterinary and consultancy services?):</label>
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
                    <label>Q2. আপনি কি প্রয়োজন অনুযায়ী আপনার প্রানি/ পাখিদের টিকা দিতে
পেরেছেন? (Do you have access to vaccination services?):</label>
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
                    <label>Q3. আপনি কি প্রয়োজন অনুযায়ী আপনার প্রানি/পাখিদের কৃমিনাষক দিতে পেরেছেন? (Do you have access to deworming services ?):</label>
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
                    <label>Q4. আপনি কি মোবাইল ক্লিনিক থেকে প্রানি চিকিৎসা সেবা নিতে পেরেছেন? (Do you have access to mobile veterinary serices?):</label>
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
                    <label>Q5. আপনি কি ইন্টারনেটের মাধ্যমে প্রানি চিকিৎসা সেবা নিতে পেরেছেন? (Do
you have access to online veterinary services?):</label>
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
                    <label>Q6. গত তিন মাসে খাদ্য নিরাপদতা ও পুষ্টি সংক্রান্ত কোন সচেতনতামুলক তথ্য
পেয়েছেন? (Got any awareness information regarding food safety and nutrition?):</label>
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
                    <label>Q1. আপনি কি গত তিন মাসে কোন উন্নত প্রযুক্তি ব্যবহার করেছেন? (Have you
used any advanced technology this month?):</label>
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
                    <label> Q1. আপনি কি নিম্নলিখিত রোগের জন্য কোনো টিকা/ কৃমিনাষক দিয়েছেন?
(Did you apply any vaccine /deworming to your livestock for the following diseases?):</label>
                        <div>
                      <div class="checkbox-label">
                        <input
                          type="checkbox"
                          id="equipmentComputer"
                          name="equipmentComputer"
                          value="Computer / Laptop / Printer"
                        />
                        <label for="equipmentComputer">
                          এফএমডি/ ক্ষুরা রোগ FMD
                        </label>
                      </div>

                      <div class="checkbox-label">
                        <input
                          type="checkbox"
                          id="equipmentTableChair"
                          name="equipmentTableChair"
                          value="Table and Chair"
                        />
                        <label for="equipmentTableChair">গলদ চর্মরোগ Lumpy Skin Disease</label>
                      </div>

                      <div class="checkbox-label">
                        <input
                          type="checkbox"
                          id="equipmentCabinet"
                          name="equipmentCabinet"
                          value="Almirah / File Cabinet"
                        />
                        <label for="equipmentCabinet">
                        PPR
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
                        Newcastle (chicken)
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
                        Fowl cholera
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
                        Avian influenza
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
                        Duck plague
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
                          Duck cholera
                        </label>
                      </div>


                    </div>
                  </div>

                  <div class="formControl">
                    <label></label>
                    <input
                      type="text"
                      id="GQ5"
                      name="GQ5"
                      value={currentMany.GQ5}
                      onChange={(e) => handleChangeMany(e)}
                    />
                  </div>


                  <div class="formControl">
                    <label>Q2. আপনার গবাদি প্রাণির ওলান প্রদাহ/ ওলান ফোলা রোগ হয়েছিল কিনা? (Has হ্যাঁ না
your cattle suffered from Mastitis?):</label>
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
                    <label>Q5. আপনি কি সবুজ ঘাস চাষ করেন? (Do you grow grass?):</label>
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
                    <label>Q. এল.ডি.ডি.পি. থেকে সেবা পেয়ে আপনি কতটুকু সন্তুষ্ট? (How would you rate your overall satisfaction with LDDP service?):</label>
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
                          খুব ভালো (excellent)
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
                        ভালো (Good)
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
                       মোটামুটি (Moderate)
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
                       খারাপ (Bad)
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
                        খুব খারাপ (Very Bad)
                      </label>


                    </div>
                  </div>






                  <div class="formControl">
                    <label> মন্তব্য (Remarks):</label>
                        
                    <textarea
                        type="text"
                        id="remarks"
                        name="remarks"
                        // class={errorObject.groupIdentityCode}
                        value={currentMany.remarks}
                        onChange={(e) => handleChangeMany(e)}
                        rows={4}
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

export default FarmersDataCollection;
