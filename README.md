# monorepo-start

基于 yarn 的 **monorepo** 项目构建。

**monorepo**是一种项目组织的方式, 内部包括多个应用及若干公共库（util、hooks, ui components）.

一般 **monorepo** 的项目目录结构类似于：

```bash
  monorepo/
  ├─ docs/
  ├─ apps/
  │  ├─ pc/
  │  ├─ mobile/
  ├─ packages/
  │  ├─ ui/
  │  ├─ utils/
```

定义这样的目录结构是为了将应用、库、文档进行归类和区分, 不过这个结构不是固定的, 我们可以定义任意的目录结构, 不过不管怎么定义我们都要使用配置文件进行描述，以 `yarn`, `npm` 为例：

```json
{
  // 指定docs是一个项目
  // 指定apps 和 packages 下的每一个目录都是一个项目
  "workspaces": ["docs", "apps/*", "packages/*"]
}
```

- docs 文档开发
- apps 应用集合

  > apps 的应用, package.json 文件中应设置 "private": true, 以防止发布到 npm.

- packages 共享资源库

  > packages 下的库用于共享，会被 apps 下的应用所引用, 同时 packages 下的库也常被发布到 npm，用以更多项目的共享。

相关资料：

- [yarn workspaces](https://yarnpkg.com/features/workspaces)

- [vue-cli](https://cli.vuejs.org/zh/)

- [typescript tsconfig](https://www.typescriptlang.org/zh/tsconfig#extends)

- [rollup](https://rollupjs.org/guide/zh/)

- [rollup awesome](https://github.com/rollup/awesome)

## 项目创建流程

- mkdir monorepo-start & yarn init & git init
- mkdir `packages` & `apps` for libarary & application

  - libarary: code share includes hooks, utils, ui, assets
  - application: frontend application/project for release

- modify the workspace package.json

  ```json
  // setting the workspaces in root's package.json
  {
    "workspaces": [
      // put applications
      "apps/*",
      // put libararies
      "packages/*"
    ]
  }
  ```

- cd apps & `vue create {project name}` -> add application

  - move depedency from app package.json to workspace package.json in root

    ```bash
      # 将相关依赖安装到项目空间下的 package.json 中便于管理
      # 也可以将相关依赖如： "vue": "^3.2.37"等 直接复制到项目空间下的package.json中
      # ps: 以下命令用于依赖转移并升级
      yarn add vue vue-router -W

      # 依赖转移到项目空间下，并升级
      yarn add typescript -W -D
    ```

  - `Note:` depedency starts with `@vue` should stay in app's package.json
    ```json
    // @vue 相关依赖必须放到 应用内部的package.json中才会正常运行
    // 否则会运行失败
    {
      "@vue/cli-plugin-babel": "^5.0.7",
      "@vue/cli-plugin-eslint": "^5.0.7",
      "@vue/cli-plugin-router": "^5.0.7",
      "@vue/cli-plugin-typescript": "^5.0.7",
      "@vue/cli-plugin-unit-jest": "^5.0.7",
      "@vue/cli-service": "^5.0.7",
      "@vue/eslint-config-typescript": "^11.0.0",
      "@vue/test-utils": "^2.0.2",
      "@vue/vue3-jest": "^28.0.1"
    }
    ```

- cd packages -> add libarary

  - add shared lib
  - use rollup to boudle code

    ```json
    // package.json
    {
      // use rollup to boudle common js & es, and set lib main entry
      "main": "dist/index.js",
      "module": "dist/index.es.js",

      // depedencys -> move to workspace package.json
      "dependencies": {
        "tslib": "^2.4.0"
      },
      "devDependencies": {
        "rollup": "^2.75.7",
        "rollup-plugin-typescript2": "^0.32.1",
        "typescript": "^4.7.4"
      }
    }
    ```

    ```json
    // tsconfig.json
    {
      "compilerOptions": {
        "sourceMap": true,
        "moduleResolution": "node",
        "importHelpers": true,
        "target": "esnext",
        "module": "esnext",
        "lib": ["es2017", "dom"],
        "skipLibCheck": true,
        "skipDefaultLibCheck": true,
        // boudle code with Types
        // 打包时将类型抽取出来
        "declaration": true
      },
      "include": ["**/*.ts"]
    }
    ```

- add libarary to apps

  > as lib name `shared` may conflict with depedency in node_modules, so shared dep should modify name property in package.json for example: `@monorepo-start/shared`

  - the first way

    > set shared dep to app one by one

    ```json
    // package.json in apps
    {
      "dependencies": {
        // yarn will add shared to apps
        // just * the assign any version / 指定任意版本
        // "shared": "*"
        "@monorepo-start/shared": "*"
        // "shared": "^1.0.0" // assign the version
      }
    }
    ```

  - the second way

    > set shared dep to all apps

    ```json
    // package.json in workspace
    {
      "dependencies": {
        // "@monorepo-start/shared": "workspace:*"
        "@monorepo-start/shared": "*"
      }
    }
    ```

## Yarn workspace(s) 命令相关

- `yarn workspaces info` -> list workspaces packages

  ```json
  {
    "vue-h5-start": {
      "location": "apps/vue-h5-start",
      "workspaceDependencies": ["@monorepo-start/shared"],
      "mismatchedWorkspaceDependencies": []
    },
    "vue-pc-start": {
      "location": "apps/vue-pc-start",
      "workspaceDependencies": ["@monorepo-start/shared"],
      "mismatchedWorkspaceDependencies": []
    },
    "@monorepo-start/shared": {
      "location": "packages/shared",
      "workspaceDependencies": [],
      "mismatchedWorkspaceDependencies": []
    }
  }
  ```

- `yarn workspaces run <command>`

  > 执行 workspaces 所有项目的 `<command>` 命令

  - `yarn workspaces run build` -> 所有项目执行 build 命令
  - `yarn workspaces run test` -> 所有项目执行 test 命令

- `yarn workspace <projectname> run <command>`

  > 指定项目并运行命令

  - `yarn workspace vue-h5-start run serve` -> 启动 vue-h5-start 项目
  - `yarn workspace vue-h5-start add lodash` -> 给 vue-h5-start 添加依赖

- `yarn add lodash -W`: -W 指，将依赖添加到公共的 package.json(in root folder)中

  > 注意：当某个依赖在多个应用或库中使用时才应将依赖安装到根目录的 package.json 中。

## 项目启动 & 构建前置

当我们的应用依赖了某个 package 时，需要先构建对应的 package 然后再运行项目，如：

- yarn workspace @monorepo-start/common run build
- yarn workspace vue-h5-start run serve

## tsconfig 相关

通常项目中，都会配置相关 Path 别名来提高模块引用效率，如：vue-cli 会默认将 `@` 识别到 项目的 `src`目录.

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

首先，我们要知道，tsconfig.json 不仅仅是编译 typescript 的配置文件，也是编辑器用来进行分析的文件，我们在编辑器(vscode)中使用[command + 鼠标左键]能够正确的跳转到模块文件中，就是依赖编辑器对 tsconfig.json 的分析。

除了 tsconfig.json, 在不使用 ts 的项目中，也会有 jsconfig.json 可以辅助编辑器识别相关路径。

那在 monorepo 多项目状态下，怎么保证 libaray 和 app 的 路径识别呢？

### app 识别 libaray 路径

配置 app 项目下的 tsconfig.json 文件, 在 Path 中添加别名。

```json
{
  "compilerOptions": {
    "paths": {
      // 模块别名
      "@monorepo-start/shared": ["../../packages/shared/src/index.ts"],
      // 项目中代码存放路径
      "@/*": ["src/*"]
    }
  }
}
```

这种方式的坏处是，每个 app 项目中，每添加一个 library 库，都需要添加 别名配置。

通常在 monorepo 项目中，会在根目录添加 tsconfig.base.json 文件，用来存放公共的 tsconfig 配置，然后在每个 app 的 tsconfig.json 中继承, 这样相关公共配置就可以集中管理了如：

```json
// tsconfig.base.json
{
  "compilerOptions": {
    // ...
    "baseUrl": ".",
    "paths": {
      // alias for apps
      "@h5": ["apps/vue-h5-start/src/*"],
      "@pc": ["apps/vue-pc-start/src/*"],

      "~/*": ["packages/*"],
      "@monorepo-start/shared": ["packages/shared/src/index.ts"]
      // ... other libararies
    }
  }
  // ...
}
```

```json
// tsconfig.json in apps
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    // app tsconfig 配置paths 后，会覆盖 tsconfig.base.json 中的paths
    // 此时其它模块的导入会出现识别错误如： @monorepo-start/shared
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

这种方式的好处时, libararies 的别名配置可以集中在一起进行管理.  
而这种方式的坏处是，app 中原有的别名 `@` 配置会被破坏掉，  
由于 tsconfig 的 `extends` 无法使 paths 的配置合并,  
所以若 app 下的 tsconfig.json 如果配置 paths 属性，会覆盖 tsconfig.base.json 中 paths 配置，  
因此只能在 tsconfig.base.json 中, 单独为每个 app 设置指定的别名。

## tsconfig 识别 js 模块

> 有些时候我们可能会在 ts 项目中使用 js 来书写组件如：

1. 组件过于简单写 ts 类型多余。
2. 有人不想写、不去写。

此时在 js 文件中，会失去别名的识别, 如：

```js
// .                module not resolved
import { test } from '@/src/util';
```

```html
<<template>
  <div>{{text}}</div>
</template>

<script>
  // script lost lang="ts"
  // .                module not resolved
  import { test } from '@/src/util';
</script>
```

为了兼容这种情况，只需要在 `tsconfig.json`中配置：

```json
{
  "compilerOptions": {
    "allowJs": true
  }
}
```

## pnpm

> [pnpm](https://www.pnpm.cn/workspaces)是一个高效的包管理器, 不仅安装速度更快，还能够节省磁盘空间, 同时对 monorepo 支持也非常好，有不少库如：vue 都已经转到 pnpm 进行项目的管理。

## Lerna , Nx, turborepo

虽然 yarn, pnpm 本身支持 monorepo 项目的管理, 但提供的功能相对基础，为了更好的对 monorepo 项目进行组织、管理、发布等，推荐使用针对性更强的管理工具：

- [Lerna](https://lerna.js.org/docs/getting-started)

  > lerna 是一个老牌的 monorepo 管理工具, 虽然在 lerna4.0 后项目处于停止维护状态，但目前已经由 **_Nx_** 接管，并发布了 lerna 5.0.

- [Nx](https://nx.dev/getting-started/intro)

  > Nx 是一个小巧，快速，扩展性强的 monorepo 构建工具, 构建过程中不仅可以控制构建顺序，还对构建内容进行缓存及对比, 以提高构建效率，同时 nx 拥有大量的模版用于生成应用和库, 方便我们进行项目的搭建.

- [Turborepo](https://turborepo.org/docs)
  > Turborepo 是一个较新的 monorepo 构建工具，与 nx 类似, 不过与 nx 相比，缺少了相关模版。

## Add Nx to this monorepo

将 nx 添加到当前 monorepo 工程中，以获得更好的性能提升:

- 流程控制： 打包应用时，控制依赖打包完成，再打包应用
- 编译缓存： 首次打包后，构建产物会被缓存，再次打包会进行缓存的判断加快打包速度

引入步骤：

- 执行 `npx add-nx-to-monorepo`

  - 添加 **Nx** 依赖到 monorepo's package.json
  - 添加 **nx.json**(配置文件) 到根目录

- 执行 `yarn nx graph` -> 分析 monorepo 依赖关系并图形化显示

- 执行 `yarn nx run-many --target=build --all` 进行所有项目的打包

  > 打包过程中，可以看到被应用依赖的 packages 会优先打包, 其次是应用的打包。

- 再次执行 `yarn nx run-many --target=build --all`
  > 由于首次打包，相关构建产物已缓存，再次打包速度将直接忽略或进行增量编译(被修改的项目再次被打包).

nx 命令相关：

- `yarn nx run-many --target=build --all` 执行所有项目的 `build` 脚本

- `yarn nx run-many --target=build --project=vue-h5-start,vue-pc-start` 执行 h5/pc 两个项目的 `build` 脚本

- `yarn nx <script> <projectname>` 执行某个项目的 script 脚本

  > 如：**yarn nx build vite-react**： 执行 vite-react 应用的 **build** 脚本

- `yarn nx affected --target=build --all` 执行所有被修改的及受影响的项目

  > 假如修改了 **react-ui** package, 则以上命令等同于：`yarn nx run-many --target=build --project=vite-react,react-ui`

- `yarn nx affected:graph` 分析 monorepo 文件修改，并以图形关系展示出被修改及受影响的内容

Note: `affected` 相关的命令会以某个分支作为参考对象，与当前工程的内容进行对比，来分析出被修改及受影响的内容。

```json
// nx.json
{
  "extends": "nx/presets/npm.json",
  "tasksRunnerOptions": {
    "default": {
      "runner": "nx/tasks-runners/default",
      "options": {
        // 设置要缓存的命令
        // 再首次执行完命令后，再次执行将根据缓存内容判断
        "cacheableOperations": ["build", "preview", "test:unit", "lint", "test"]
      }
    }
  },
  "targetDefaults": {
    // 控制执行 build命令时，先执行其依赖的 build
    "build": {
      "dependsOn": ["^build"]
    }
  },
  "affected": {
    // affected 命令用来进行文件比对的参照分支
    "defaultBase": "main"
  }
}
```

参考：[Adding Nx to Lerna/Yarn/PNPM/NPM Workspace](https://nx.dev/migration/adding-to-monorepo)
