import { IApi } from '@umijs/types';
const shell = require('shelljs');

export default function(api: IApi) {
  api.logger.info('use wizard plugin');
  //注册一个参数
  api.describe({
    key: 'wizard',
    config: {
      //不知道这个为啥不生效
      default: {
        dir: '__wizard__',
        list: 'list',
        detail: 'detail',
      },
      schema(joi) {
        return joi.object({
          dir: joi.string(),
          list: joi.string(),
          detail: joi.string(),
        });
      },
    },
  });

  const { wizard = {} } = api.userConfig;
  const { dir = '__wizard__', list = 'list', detail = 'detail' } = wizard;

  api.onStart(() => {
    //先杀掉8100进程(现金单这么写吧)
    const result = shell.exec(
      `lsof -i :8100 | awk '{print $2}' | awk 'NR==2{print}'`,
    );
    const pid = result.stdout;
    if (pid > 0) {
      shell.exec(`kill -9 ${pid}`);
    }

    let child = shell.exec(
      `node ${api.paths.absNodeModulesPath}/umi-plugin-wizard/lib/server.js`,
      {
        async: true,
      },
    );
    child.stdout.on('data', function(data: any) {
      /* ... do something with data ... */
      // console.log(data);
    });
  });

  api.modifyRoutes(routes =>
    routes.map(r => {
      if (r.path === '/') {
        r.routes = r.routes?.concat({
          path: `/${dir}`,
          title: '开发工具',
          hideInHeader: true,
          routes: [
            {
              path: `/${dir}`,
              title: '开发工具',
              component: `@/${dir}/${list}`,
              exact: true,
            },
            {
              path: `/${dir}/:id`,
              title: '布局插件',
              component: `@/${dir}/${detail}`,
              exact: true,
            },
          ],
        });
      }
      return r;
    }),
  );
}
