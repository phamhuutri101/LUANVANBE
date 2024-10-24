const nodemailer = require("nodemailer");
const UserModel = require("../models/user");
const ObjectId = require("mongoose").Types.ObjectId;
class sendEmailServices {
  static sendEmail = async (email, code) => {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // async..await is not allowed in global scope, must use a wrapper
    async function main() {
      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: '"Kích Hoạt Tài Khoản" <hamhuutritestmail@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Xin chào", // Subject line
        text: "Hello world?", // plain text body
        html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
      <div style="margin:50px auto;width:70%;padding:20px 0">
        <div style="border-bottom:1px solid #eee">
          <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Sàn Thương mại Điện Tử Xanh</a>
        </div>
        <p style="font-size:1.1em">Hi,</p>
        <p>Cảm ơn bạn đã đăng ký tài khoản tại sàn thương mại điện tử, Sử dụng mã OTP để hoàn tất thủ tục Đăng ký của bạn. Mã OTP có hiệu lực 5 phút</p>
        <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${code}</h2>
        <hr style="border:none;border-top:1px solid #eee" />
        <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
          <p>Your Brand Inc</p>
          <p>1600 Amphitheatre Parkway</p>
          <p>California</p>
        </div>
      </div>
    </div>`, // html body
      });

      console.log("Message sent: %s", info.messageId);
      // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
    }

    main().catch(console.error);
  };
  static emailUser = async (id_user) => {
    const ID_USER = new ObjectId(id_user);
    const email = await UserModel.findOne(
      { _id: ID_USER },
      { EMAIL_USER: 1, _id: 0 }
    );
    return email;
  };
  static sendMailOrder = async (email) => {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // async..await is not allowed in global scope, must use a wrapper
    async function main() {
      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: '"Cảm ơn bạn đã mua hàng" <hamhuutritestmail@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Thư cảm ơn", // Subject line
        text: "Hello world?", // plain text body
        html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
      <div style="margin:50px auto;width:70%;padding:20px 0">
        <div style="border-bottom:1px solid #eee">
          <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Sàn Thương Mại Điện Tử</a>
        </div>
        
        <p>Cảm ơn bạn đã mua hàng tại shop đơn hàng của bạn đang được xử lý và giao đến bạn trong thời gian sớm nhất</p>
        <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">Đừng quên đánh giá 5 sao nhé</h2>
        <p style="font-size:0.9em;">Regards,<br />Your Brand</p>
        <hr style="border:none;border-top:1px solid #eee" />
        
      </div>
    </div>`, // html body
      });

      console.log("Message sent: %s", info.messageId);
      // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
    }

    main().catch(console.error);
  };
  static sendMaiStopAccount = async (email, name_account) => {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // async..await is not allowed in global scope, must use a wrapper
    async function main() {
      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: '"Dừng hoạt động tài khoản trên sàn giao dịch thương mại điện tử" <phamhuutritestmail@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Thông báo dừng hoạt động tài khoản", // Subject line

        html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
      <div style="margin:50px auto;width:70%;padding:20px 0">
        <div style="border-bottom:1px solid #eee">
          <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Sàn Thương Mại Điện Tử</a>
        </div>
        
        <p>Đã phát hiện sai phạm của bạn trên sàn thương mại điện tử và đã có quyết định dừng hoạt động tài khoản <span style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;"> ${name_account} </span> </p>
      
        <p style="font-size:0.9em;">Regards,<br />Mọi thắc mắc xin liên hệ phamhuutritestmail@gmail.com để được giải đáp</p>
        <hr style="border:none;border-top:1px solid #eee" />
        
      </div>
    </div>`, // html body
      });

      console.log("Message sent: %s", info.messageId);
      // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
    }

    main().catch(console.error);
  };
  static sendReactiveAcount = async (email, name_account) => {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // async..await is not allowed in global scope, must use a wrapper
    async function main() {
      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: '"Cấp phép lại hoạt động của tài khoản " <phamhuutritestmail@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Thông báo Tài khoản đã được mở khóa", // Subject line

        html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
      <div style="margin:50px auto;width:70%;padding:20px 0">
        <div style="border-bottom:1px solid #eee">
          <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Sàn Thương Mại Điện Tử</a>
        </div>
        
        <p>Tài khoản <span style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;"> ${name_account} </span> đã được xem xét mở khóa tài khoản bạn có thể tiếp tục mua sắm, bán hàng trên tài khoản ${name_account} một cách bình thường </p>
      
        <p style="font-size:0.9em;">Regards,<br />Mọi thắc mắc xin liên hệ phamhuutritestmail@gmail.com để được giải đáp</p>
        <hr style="border:none;border-top:1px solid #eee" />
        
      </div>
    </div>`, // html body
      });

      console.log("Message sent: %s", info.messageId);
      // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
    }

    main().catch(console.error);
  };
}

module.exports = sendEmailServices;
