import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import * as path from 'path';

export const MailerProvider = {
  provide: 'MAIL_TRANSPORTER',
  useFactory: (configService: ConfigService): hbs.HbsTransporter => {
    const transporter = createTransport({
      host: configService.getOrThrow<string>('EMAIL_HOST'),
      port: parseInt(configService.getOrThrow<string>('EMAIL_PORT'), 10),
      auth: {
        user: configService.getOrThrow<string>('EMAIL_USER'),
        pass: configService.getOrThrow<string>('EMAIL_PASS'),
      },
    });

    transporter.use(
      'compile',
      hbs({
        viewEngine: {
          extname: '.hbs',
          partialsDir: path.join(
            process.cwd(),
            'src/modules/notification/application/templates/partials',
          ),
          layoutsDir: path.join(
            process.cwd(),
            'src/modules/notification/application/templates/layouts',
          ),
          defaultLayout: false,
        },
        viewPath: path.join(
          process.cwd(),
          'src/modules/notification/application/templates/views',
        ),
        extName: '.hbs',
      }),
    );

    return transporter as hbs.HbsTransporter;
  },
  inject: [ConfigService],
};
