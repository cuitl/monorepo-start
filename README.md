# vue-start-monorepo

基于 yarn, vue 的 **monorepo** 项目

## 项目创建流程

- mkdir vue-start-monorepo & yarn init & git init
- mkdir `packages` & `apps` for libarary & application
  - libarary: code share includes hooks, utils, ui, assets
  - application: frontend application/project for release
- modify the workspace package.json
  ```json
  // setting the workspaces folder
  {
    "workspaces": [
      // put application
      "apps/*",
      // put libarary
      "packages/*"
    ]
  }
  ```
- cd apps & `vue create {project name}` -> add application

  - move depedency from app package.json to workspace package.json in root

    ```bash
      # 将相关依赖安装到项目空间下的 package.json 中便于管理
      # 也可以将相关依赖 "vue": "^3.2.37" 直接复制到项目空间下的package.json中
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

  - the first way

    > set shared dep to app one by one

    ```json
    // package.json in apps
    {
      "dependencies": {
        // yarn will add shared to apps
        // just * the assign any version / 指定任意版本
        "shared": "*"
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
        "shared": "workspace:*"
      }
    }
    ```
