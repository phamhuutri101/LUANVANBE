//https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
//parameters
const crypto = require("crypto");
const moment = require("moment");
const CryptoJS = require("crypto-js");
const axios = require("axios").default;
class PaymentMethod {
  static payment = async (price) => {
    var accessKey = process.env.accessKeyMomo;
    var secretKey = process.env.secretKeyMomo;
    var orderInfo = "pay with MoMo";
    var partnerCode = "MOMO";
    var redirectUrl =
      "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b";
    var ipnUrl =
      "https://114b-2402-800-6390-84b8-1908-930a-3ff3-db3f.ngrok-free.app/v1/payment/callback";
    var requestType = "payWithMethod";
    var amount = price;
    var orderId = partnerCode + new Date().getTime();
    var requestId = orderId;
    var extraData = "";
    var orderGroupId = "";
    var autoCapture = true;
    var lang = "vi";

    //before sign HMAC SHA256 with format
    //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    var rawSignature =
      "accessKey=" +
      accessKey +
      "&amount=" +
      amount +
      "&extraData=" +
      extraData +
      "&ipnUrl=" +
      ipnUrl +
      "&orderId=" +
      orderId +
      "&orderInfo=" +
      orderInfo +
      "&partnerCode=" +
      partnerCode +
      "&redirectUrl=" +
      redirectUrl +
      "&requestId=" +
      requestId +
      "&requestType=" +
      requestType;
    //puts raw signature
    console.log("--------------------RAW SIGNATURE----------------");
    console.log(rawSignature);
    //signature
    const crypto = require("crypto");
    var signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");
    console.log("--------------------SIGNATURE----------------");
    console.log(signature);

    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
      partnerCode: partnerCode,
      partnerName: "Test",
      storeId: "MomoTestStore",
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      lang: lang,
      requestType: requestType,
      autoCapture: autoCapture,
      extraData: extraData,
      orderGroupId: orderGroupId,
      signature: signature,
    });
    //option for axios
    const options = {
      method: "POST",
      url: "https://test-payment.momo.vn/v2/gateway/api/create",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody),
      },
      data: requestBody,
    };
    let result;
    try {
      result = await axios(options);
      return result.data;
    } catch (error) {
      if (error.response) {
        return {
          message: error.message,
          success: false,
          data: null,
          status: error.response.status,
        };
      } else if (error.request) {
        return {
          message: "Không nhận được phản hồi từ máy chủ",
          success: false,
          data: null,
        };
      } else {
        return {
          message: "Lỗi trong thiết lập yêu cầu: " + error.message,
          success: false,
          data: null,
        };
      }
    }
  };
  static transactionStatus = async (orderId) => {
    try {
      const accessKey = process.env.accessKeyMomo;
      const secretKey = process.env.secretKeyMomo;

      const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;
      const signature = crypto
        .createHmac("sha256", secretKey)
        .update(rawSignature)
        .digest("hex");

      const requestBody = {
        partnerCode: "MOMO",
        requestId: orderId,
        orderId: orderId,
        lang: "vi",
        signature: signature,
      };

      console.log("Request Body:", requestBody);

      const options = {
        method: "POST",
        url: "https://test-payment.momo.vn/v2/gateway/api/query",
        headers: {
          "Content-Type": "application/json",
        },
        data: requestBody,
      };

      const result = await axios(options);
      return result.data;
    } catch (error) {
      console.error("Error in transactionStatus:", error.message);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        return {
          message: error.message,
          success: false,
          data: null,
          status: error.response.status,
        };
      } else if (error.request) {
        return {
          message: "Không nhận được phản hồi từ máy chủ",
          success: false,
          data: null,
        };
      } else {
        return {
          message: "Lỗi trong thiết lập yêu cầu: " + error.message,
          success: false,
          data: null,
        };
      }
    }
  };
}
module.exports = PaymentMethod;
