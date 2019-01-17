- 本 Demo 主要用来演示用 react-coat 来开发**SPA 单页应用**，请先花点时间了解一下：[react-coat v4.0](https://github.com/wooline/react-coat)
- react-coat 同时支持`客户端渲染`和`服务器渲染(SSR)`，本 Demo 仅演示`客户端渲染`,如果你需要`服务器渲染(SSR)`，可以在看完本 Demo 之后再查看： [SPA(单页应用)+SSR(服务器渲染)](https://github.com/wooline/react-coat-ssr-demo)
- [本 Demo 讨论提问专用贴](https://github.com/wooline/react-coat-spa-demo/issues/1)
- reac-coat 学习交流 QQ 群：**929696953**，有问题可以在群里问我

---

- [概要总览](https://github.com/wooline/react-coat-spa-demo)
- [业务需求](https://github.com/wooline/react-coat-spa-demo/blob/master/docs/requirements.md)
- [路由设计](https://github.com/wooline/react-coat-spa-demo/blob/master/docs/router.md)
- [模块与目录结构](https://github.com/wooline/react-coat-spa-demo/blob/master/docs/modules.md)
- **重用与继承**
  - [资源 Resource](#资源-resource)
  - [抽象 Resource Module 类型](#抽象-resource-module-类型)
  - [抽象 Resource Module 动作](#抽象-resource-module-动作)
  - [重载与重写](#重载与重写)
- [创建一个新 Module](https://github.com/wooline/react-coat-spa-demo/blob/master/docs/setup.md)

react-coat 支持 ModuleState 和 ModuleActionHanders 的继承，使得我们可以对模块和操作进行抽象与泛化。

## 资源 Resource

从 RESTful 中受到启发，我们所有的业务实体都可以被抽象成一种资源，所有操作基本上可以归类为对资源的增、删、改、查。如果我们的 UI 交互设计也是以此为理念，一种视图对应一种资源的维护，那我们从代码层面也可以对一种资源建立一个 `Resource Module` 来维护。

## 抽象 Resource Module 类型

一般来说，对一种资源的维护，无非就是增、删、改、查，所以在 Resource Module 中通常需要定义如下数据结构：

```JS
// /src/entity/resource.ts
export interface Defined {
  State: {}; // 定义本ModuleState数据结构
  SearchData: {}; // 定义本Module中的路由数据结构
  PathData: {}; // 定义本Module中的路由数据结构
  HashData: {}; // 定义本Module中的路由数据结构
  ListItem: {}; // 定义该资源列表中的单条数据结构
  ListSearch: {}; // 定义该资源列表的查询条件数据结构
  ListSummary: {}; // 定义该资源列表的查询返回摘要数据结构
  ItemDetail: {}; // 定义该资源的详情数据结构，对于简单的资源，可能与ListItem相同
  ItemEditor: {}; // 定义该资源的创建与编辑的数据结构，可能与ItemDetail相同
  ItemCreateData: {};  // 定义该资源的创建时需要发送给后台API的数据结构，可能与ItemEditor相同
  ItemUpdateData: {};  // 定义该资源的更新时需要发送给后台API的数据结构，可能与ItemCreateData相周
  ItemCreateResult: {}; // 定义该资源创建后，后台API Resphonse的数据结构
  ItemUpdateResult: {}; // 定义该资源更新后，后台API Resphonse的数据结构
}

// 进一步具化本项目中的通常结构
export type ResourceDefined = Defined & {
  State: BaseModuleState; 模块的State必须继承 react-coat 的 BaseModuleState
  PathData: {itemId?: string}; 资源详情路由通常是这种格式：/photos/item/:itemId
  ListItem: {
    id: string; // 资源列表单条通常至少包含有id
  };
  ListSearch: {
    page: number; // 资源列表查询条件通常至少包含页码
    pageSize: number;
  };
  ListSummary: { // 资源列表摘要通常至少包含分页信息
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
  ItemDetail: {
    id: string; // 资源详情通常至少包含有id
  };
  ItemEditor: {
    type: EditorType; // 编辑类型通常至少分create和update
  };
  ItemUpdateData: {
    id: string; // create时通常没有id, update时通常有id
  };
  ItemCreateResult: DefaultResult<{id: string}>;
  ItemUpdateResult: DefaultResult<void>;
};
```

## 抽象 Resource Module 动作

一般来说，对一种资源的维护，无非就是增、删、改、查，所以在 Resource Module 中的操作基本上可以归纳为：

```JS
// /src/common/ResourceHandlers.ts
export default class Handlers<S extends R["State"] = R["State"], R extends Resource = Resource> extends BaseModuleHandlers<S, RootState, ModuleNames> {

  // 查询列表
  @effect()
  public async searchList(options: R["ListOptions"] = {}) {
    // 将查询条件与当前条件 merge
    const listSearch: R["ListSearch"] = {...this.state.listSearch!, ...options};
    // 调用后台 API并获取数据
    const {listSearch, listItems, listSummary} = await this.config.api.searchList(listSearch);
    // this.updateState() 会调用 reducer 更新 state
    this.updateState({listItems, listSummary});
  }

  // 通过id获取详情
  @effect()
  public async getItemDetail(itemDetailId: string) {
    // 调用后台 API
    const arr = [this.config.api.getItemDetail!(itemDetailId)];
    if (this.config.api.hitItem) { //有的资源可能需要算点击次数
      arr.push(this.config.api.hitItem!(itemDetailId));
    }
    const [itemDetail] = await Promise.all(arr);
    // this.updateState() 会调用 reducer 更新 state
    this.updateState({itemDetail});
  }

  // 更新一条资源
  @effect()
  protected async updateItem(data: R["ItemUpdateData"]) {
    // 调用后台 API
    const response = await this.config.api.updateItem!(data);
    if (!response.error) {
      Toast.info("操作成功");
      this.updateState({itemEditor: undefined}); // 关闭当前创建窗口
      this.searchList(); // 通常更新后需要刷新列表
    } else {
      Toast.info(response.error.message);
    }
    return response;
  }

  // 删除资源
  @effect()
  protected async deleteItems(ids: string[]) {
    // 调用后台 API
    await this.config.api.deleteItems!(ids);
    Toast.info("操作成功");
    this.updateState({selectedIds: []}); // 清空当前选中项
    this.searchList(); // 通常删除后需要刷新列表
  }

  ...
}
```

## 重载与重写

以上 State 和 ActionHandlers 或许可以适应于大部分的 Resource Module，而对于某些特殊模块，我们可以用子类来重载与重写：

```JS
// src/entity/photo.ts
interface Item {
  title: string;
  departure: string;
  type: string;
  hot: number;
  price: number;
  coverUrl: string;
  comments: number;
}

export type PhotoDefined = ArticleDefined & {
  ListItem: Item;
  ItemDetail: Item & {remark: string; picList: string[]};
  SearchData: {showComment: boolean};
  State: {showComment?: boolean};
};
```

```JS
// src/modules/photos/model.ts
class ModuleHandlers extends ArticleHandlers<State, PhotoResource> {
  constructor() {
    super({}, {api});
  }
  @effect()
  protected async parseRouter() {
    const result = await super.parseRouter();
    this.updateState({showComment: result.moduleSearchData.showComment});
    return result;
  }
  @effect()
  protected async [ModuleNames.photos + "/INIT"]() {
    await super.onInit();
  }
}
```
