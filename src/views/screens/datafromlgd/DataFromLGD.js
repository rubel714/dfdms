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

const DataFromLGD = (props) => {
  const serverpage = "datafromlgd"; // this is .php server page

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
          <h3>
            Home ❯ Data Collection ❯ Data From LGD
          </h3>
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
                  <h2>গ্ৰুপের তথ্য সংগ্রহ ফরম (Large Group Discussion Data)</h2>
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
                    <label>Basic Information</label>
                  </div>


                  <div class="formControl">
                    <label>BQ1. দলের নামঃ (Group name):</label>
                    <input
                      type="text"
                      id="BQ1"
                      name="BQ1"
                      value={currentMany.BQ1}
                      onChange={(e) => handleChangeMany(e)}
                    />
                  </div>



                  <div class="formControl">
                    <label>BQ2. দলের প্রকারঃ (Value Chain):</label>
                    <input
                      type="text"
                      id="BQ2"
                      name="BQ2"
                      value={currentMany.BQ2}
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
                    <label>BQ3. দলের আইডি (Group Identity Code):</label>
                    <input
                      type="text"
                      id="BQ3"
                      name="BQ3"
                      value={currentMany.BQ3}
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
                    <label>1 PG Mobilization</label>
                   
                  </div>



                  <div className="formControl">
                    <label>Q1a. Formation of Executive Committee (EC) for the PG:</label>
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
                        We, PG members don't have any role or power to make decisions on the formation of EC
                      </label>

                      <label className="radio-label">
                        <input
                          type="radio"
                          id="Q1radioNo1"
                          name="Q1radio"
                          value="No"
                          checked={currentMany.Q1radio === "Yes"}
                          onChange={(e) => handleChangeMany(e)}
                        />
                        We, PG members are interested in forming EC but no one asks us for our opinion
                      </label>

                      <label className="radio-label">
                        <input
                          type="radio"
                          id="Q1radioNo2"
                          name="Q1radio"
                          value="No"
                          checked={currentMany.Q1radio === "Yes"}
                          onChange={(e) => handleChangeMany(e)}
                        />
                        We, PG members ask for our opinion in forming EC, but formation of EC is done other than PG members
                      </label>

                      <label className="radio-label">
                        <input
                          type="radio"
                          id="Q1radioNo3"
                          name="Q1radio"
                          value="No"
                          checked={currentMany.Q1radio === "Yes"}
                          onChange={(e) => handleChangeMany(e)}
                        />
                        We, PG members form EC through votes and can change the EC by our voting exercise at any time
                      </label>
                    </div>
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

export default DataFromLGD;
