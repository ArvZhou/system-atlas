// 技术演化史数据
// 每个阶段回答三个问题：遇到了什么瓶颈？探索过哪些思路？最终大家接受了什么？

export type IdeaVerdict = "accepted" | "rejected" | "partial";

export type EvolutionIdea = {
  name: string;
  desc: string;
  verdict: IdeaVerdict;
};

export type EvolutionQuestion = {
  q: string;
  a: string;
  points?: string[];
};

export type EvolutionStage = {
  id: string;
  /** 序号标签，如 "01" */
  index: string;
  /** 技术名，如 "Spring IoC" */
  title: string;
  /** 一句话触发器，对应用户图里的 "对象越来越多" */
  trigger: string;
  /** 粗略年代 */
  era: string;
  /** 详细瓶颈描述 */
  bottleneck: string;
  /** 探索过的思路，含被接受 / 被放弃 / 部分保留 */
  ideas: EvolutionIdea[];
  /** 最终被广泛接受的方案，以及为什么 */
  solution: string;
  /** 一句话本质 */
  essence: string;
  /** 常见面试题 */
  questions: EvolutionQuestion[];
  tags?: string[];
};

export type EvolutionTrack = {
  id: string;
  name: string;
  subtitle: string;
  /** 主题色 */
  accent: string;
  stages: EvolutionStage[];
};

// ────────────────────────────────────────────────────────────────
// 主线：从一段程序，到会思考的系统
// ────────────────────────────────────────────────────────────────

const mainStages: EvolutionStage[] = [
  {
    id: "oop",
    index: "01",
    title: "OOP / 设计模式",
    trigger: "程序越来越复杂",
    era: "1980s–1990s",
    bottleneck:
      "面向过程时，数据和操作分离，函数满天飞。系统一大，改一处牵动一片，复用靠复制粘贴，谁也说不清一个流程到底经过了哪些函数。",
    ideas: [
      { name: "结构化编程", desc: "用函数和模块切分，但数据仍然裸露，状态难以约束。", verdict: "partial" },
      { name: "面向对象", desc: "把数据和行为封装进对象，用继承、多态描述关系。", verdict: "accepted" },
      { name: "设计模式", desc: "把反复出现的协作方式沉淀成 23 种可复用套路。", verdict: "accepted" },
    ],
    solution:
      "用『对象』作为封装单元，把复杂度关进边界里；再用设计模式为对象之间的协作提供通用语言。核心是面向接口而非实现，让变化局部化。",
    essence: "用封装和抽象，把复杂度关进可管理的边界。",
    questions: [
      {
        q: "面向对象的三大特性与真正价值？",
        a: "封装、继承、多态。价值不在语法，而在于把『变化』隔离：封装隐藏实现细节，多态让调用方不依赖具体类型，从而面向接口编程、开闭原则。",
        points: ["封装=隐藏实现", "多态=面向接口", "目标是隔离变化"],
      },
      {
        q: "设计模式为什么会存在？举一个你用过的。",
        a: "它是对反复出现问题的经验沉淀。例如策略模式把 if-else 分支替换成可插拔的算法对象，新增策略不改原有代码，符合开闭原则。",
      },
    ],
    tags: ["封装", "抽象", "开闭原则"],
  },
  {
    id: "tcpip",
    index: "02",
    title: "TCP / IP",
    trigger: "需要联网",
    era: "1970s–1980s",
    bottleneck:
      "单机程序再强也是孤岛。要让两台机器交换数据，得解决寻址、分包、丢包重传、乱序、拥塞——而且底层链路五花八门，不能为每种网络重写一遍。",
    ideas: [
      { name: "专用协议", desc: "每家厂商各搞一套，互不相通，无法组成大网。", verdict: "rejected" },
      { name: "OSI 七层模型", desc: "理论完备但过于理想，落地复杂，成了教学参考。", verdict: "partial" },
      { name: "TCP/IP 四层", desc: "IP 负责寻址转发，TCP 负责可靠有序，分层解耦。", verdict: "accepted" },
    ],
    solution:
      "分层。IP 只管『尽力而为』地把包送到，TCP 在其上用序号、确认、重传、滑动窗口把不可靠变可靠。每层只依赖下层接口，互联网因此可以无限拼接。",
    essence: "用分层把『寻址』和『可靠』解耦，让异构网络互联。",
    questions: [
      {
        q: "TCP 三次握手为什么是三次而不是两次？",
        a: "两次无法确认客户端的接收能力，且历史重复连接请求可能造成资源浪费。三次让双方都确认『我发你收、你发我收』均正常，并同步初始序列号。",
        points: ["双向确认收发能力", "同步 ISN", "防止历史连接"],
      },
      {
        q: "TCP 如何保证可靠传输？",
        a: "序号+确认应答、超时重传、滑动窗口做流量控制、拥塞控制（慢启动/拥塞避免/快重传快恢复），以及校验和。",
      },
    ],
    tags: ["分层", "可靠传输", "拥塞控制"],
  },
  {
    id: "http",
    index: "03",
    title: "HTTP",
    trigger: "需要网页",
    era: "1991–",
    bottleneck:
      "有了可靠的字节管道，但人要的是能超链接跳转的文档。需要一套简单、无状态、人人都能实现的应用层约定，来请求和返回资源。",
    ideas: [
      { name: "有状态长连接协议", desc: "服务器为每个用户保持会话，扩展性差，难以承载海量客户端。", verdict: "rejected" },
      { name: "无状态请求-响应", desc: "每个请求自带全部信息，服务器不记忆，天然可水平扩展。", verdict: "accepted" },
    ],
    solution:
      "HTTP 选择无状态的请求-响应模型：方法(GET/POST)+URL+头+体。无状态让任意一台服务器都能处理任意请求，是后来负载均衡、水平扩展的地基。会话状态则交给 Cookie/Session/Token 单独解决。",
    essence: "无状态，是可无限水平扩展的前提。",
    questions: [
      {
        q: "HTTP 为什么设计成无状态？带来什么问题又如何解决？",
        a: "无状态让请求可被任意节点处理，利于扩展和缓存。代价是无法识别用户，于是用 Cookie+Session（服务端存）或 Token/JWT（客户端存）来补上会话状态。",
        points: ["无状态=易扩展", "Cookie/Session vs Token", "状态外置"],
      },
      {
        q: "GET 和 POST 的本质区别？",
        a: "语义上 GET 幂等、可缓存、用于获取；POST 用于提交、有副作用。参数位置、长度限制只是表象，关键是幂等性与语义。",
      },
    ],
    tags: ["无状态", "请求响应", "水平扩展"],
  },
  {
    id: "servlet",
    index: "04",
    title: "Servlet / JSP",
    trigger: "需要动态页面",
    era: "1997–",
    bottleneck:
      "静态 HTML 无法根据用户和数据变化。CGI 每来一个请求就 fork 一个进程，开销巨大。需要一种在服务端高效生成动态内容的方式。",
    ideas: [
      { name: "CGI", desc: "每请求一进程，能动态但慢且吃资源。", verdict: "rejected" },
      { name: "Servlet", desc: "运行在容器里的线程模型，进程常驻、按请求分线程。", verdict: "accepted" },
      { name: "JSP", desc: "在 HTML 里嵌 Java，方便写页面，但易把逻辑和视图揉在一起。", verdict: "partial" },
    ],
    solution:
      "Servlet 容器把进程常驻、用线程池处理请求，解决了 CGI 的性能问题；JSP 让写页面像写 HTML。但很快发现逻辑塞进 JSP 会失控——这为 MVC 埋下伏笔。",
    essence: "容器+线程池，让动态内容生成变得可负担。",
    questions: [
      {
        q: "Servlet 的生命周期？它是线程安全的吗？",
        a: "load→init()→多次 service()→destroy()。容器通常只创建一个实例，用多线程并发调用 service，所以成员变量非线程安全，应避免可变共享状态。",
        points: ["单实例多线程", "init/service/destroy", "成员变量不安全"],
      },
    ],
    tags: ["容器", "线程模型", "动态内容"],
  },
  {
    id: "mvc",
    index: "05",
    title: "MVC",
    trigger: "代码越来越乱",
    era: "2000s",
    bottleneck:
      "SQL、业务逻辑、HTML 全糊在 JSP 里，改样式怕碰坏逻辑，改逻辑怕弄乱页面。前后端、职责边界完全混在一起，无法协作也无法测试。",
    ideas: [
      { name: "页面里写一切", desc: "开发快但不可维护，改动风险高。", verdict: "rejected" },
      { name: "MVC 分层", desc: "Model 管数据、View 管展示、Controller 管调度。", verdict: "accepted" },
    ],
    solution:
      "MVC 按『关注点』切分：Controller 接收请求并编排、Model 承载领域与数据、View 只负责渲染。职责清晰后可分工、可替换视图、可单元测试。Spring MVC、Struts 都是它的落地。",
    essence: "按关注点分离，让每一层只做一件事。",
    questions: [
      {
        q: "MVC 各层职责？Controller 应该薄还是厚？",
        a: "M 领域与数据、V 展示、C 调度。Controller 应尽量薄，只做参数校验和编排，业务下沉到 Service 层，避免『胖控制器』。",
        points: ["关注点分离", "薄 Controller", "业务下沉 Service"],
      },
    ],
    tags: ["分层", "关注点分离", "可维护性"],
  },
  {
    id: "ioc",
    index: "06",
    title: "Spring IoC",
    trigger: "对象越来越多",
    era: "2004–",
    bottleneck:
      "对象一多，谁 new 谁、谁依赖谁变成一团乱麻。手动管理创建顺序、单例、生命周期极易出错，代码被 new 和查找逻辑污染，难以替换和测试。",
    ideas: [
      { name: "手动 new / 工厂", desc: "把创建集中到工厂，但依赖关系仍硬编码。", verdict: "partial" },
      { name: "服务定位器", desc: "统一查找，但对象仍主动去『拿』依赖，耦合未消。", verdict: "partial" },
      { name: "依赖注入(IoC)", desc: "由容器负责创建并注入依赖，对象只声明需要什么。", verdict: "accepted" },
    ],
    solution:
      "控制反转：把对象的创建权、依赖装配权交给容器。对象只声明依赖（构造/字段注入），容器统一管理生命周期与单例。耦合下降，可替换、可 Mock、可测试。",
    essence: "把控制权交给容器，让对象只声明、不索取。",
    questions: [
      {
        q: "什么是 IoC 和 DI？两者关系？",
        a: "IoC 是思想：控制权（创建、装配）从代码反转给容器。DI 是实现手段：容器把依赖注入进来。构造器注入最推荐，利于不可变和强制依赖。",
        points: ["IoC 是思想 / DI 是手段", "构造器注入优先", "解耦+可测试"],
      },
      {
        q: "Spring Bean 的作用域和生命周期？",
        a: "作用域：singleton/prototype/request/session 等。生命周期：实例化→属性填充→Aware→BeanPostProcessor 前置→init→（使用）→销毁，AOP 代理也在此织入。",
      },
    ],
    tags: ["控制反转", "依赖注入", "解耦"],
  },
  {
    id: "orm",
    index: "07",
    title: "ORM",
    trigger: "数据库开发困难",
    era: "2000s",
    bottleneck:
      "手写 JDBC 要管连接、拼 SQL、逐字段 setXxx/getXxx，重复且易错。对象模型（继承、关联）和关系表模型天然不匹配（阻抗失配），映射代码泛滥。",
    ideas: [
      { name: "裸 JDBC", desc: "完全可控但样板代码巨多，易漏关连接。", verdict: "partial" },
      { name: "全自动 ORM(Hibernate)", desc: "对象直接持久化，屏蔽 SQL，但复杂查询和性能不可控。", verdict: "partial" },
      { name: "半自动(MyBatis)", desc: "自己写 SQL、框架管映射，兼顾控制力与效率。", verdict: "accepted" },
    ],
    solution:
      "ORM 用对象-关系映射消除样板代码。国内更接受 MyBatis 这类『半自动』：SQL 自己写以掌控性能，映射和连接交给框架。全自动 ORM 适合简单 CRUD，复杂场景要能下沉到 SQL。",
    essence: "在『开发效率』与『SQL 可控』之间取平衡。",
    questions: [
      {
        q: "MyBatis 和 Hibernate 的取舍？",
        a: "Hibernate 全自动、屏蔽 SQL、开发快，但复杂查询和优化困难；MyBatis 半自动、SQL 可控、性能可调，适合复杂业务。选择取决于对 SQL 控制力的需求。",
        points: ["全自动 vs 半自动", "SQL 可控性", "N+1 问题警惕"],
      },
    ],
    tags: ["对象关系映射", "阻抗失配", "SQL"],
  },
  {
    id: "ajax",
    index: "08",
    title: "AJAX",
    trigger: "页面刷新太慢",
    era: "2005–",
    bottleneck:
      "每次交互都要整页刷新、白屏、重新加载所有资源，体验割裂。用户想要像桌面软件一样的局部更新和即时反馈。",
    ideas: [
      { name: "整页刷新", desc: "简单但每次都重来一遍，体验差。", verdict: "rejected" },
      { name: "隐藏 iframe 轮询", desc: "早期 hack，勉强局部更新但脆弱。", verdict: "rejected" },
      { name: "XMLHttpRequest", desc: "浏览器异步请求数据、JS 局部更新 DOM。", verdict: "accepted" },
    ],
    solution:
      "AJAX 用 XMLHttpRequest 异步拉数据，用 JS 只更新变化的局部。页面不再整刷，前端第一次拥有了独立的数据获取能力——这直接催生了富客户端和前后端分离。",
    essence: "异步局部更新，前端获得独立的数据能力。",
    questions: [
      {
        q: "AJAX 的原理？跨域怎么解决？",
        a: "基于 XMLHttpRequest/fetch 异步请求，回调里更新 DOM。跨域受同源策略限制，用 CORS（服务端设响应头）或代理解决，老方案有 JSONP（仅 GET）。",
        points: ["异步+局部更新", "同源策略", "CORS/代理"],
      },
    ],
    tags: ["异步", "前后端分离", "同源策略"],
  },
  {
    id: "frontend-stack",
    index: "09",
    title: "Webpack / React / Vue",
    trigger: "前端越来越复杂",
    era: "2013–",
    bottleneck:
      "AJAX 之后前端承担越来越多逻辑，jQuery 手动操作 DOM 在大型应用里变成意大利面：状态散落、更新顺序难控、模块依赖靠 script 标签堆叠。",
    ideas: [
      { name: "jQuery 命令式", desc: "直接操作 DOM，小项目高效，大项目状态失控。", verdict: "rejected" },
      { name: "数据驱动视图", desc: "声明 UI=f(state)，状态变则视图自动更新。", verdict: "accepted" },
      { name: "模块化+打包(Webpack)", desc: "用模块组织代码，打包工具处理依赖与构建。", verdict: "accepted" },
    ],
    solution:
      "React/Vue 用『数据驱动视图』+ 组件化 + 虚拟 DOM，把手动 DOM 操作变成声明式；Webpack 等打包工具解决模块依赖、转译、按需加载。前端正式工程化，成为独立学科。",
    essence: "UI = f(state)：把命令式 DOM 变成声明式渲染。",
    questions: [
      {
        q: "虚拟 DOM 的价值到底是什么？",
        a: "不是绝对更快，而是提供了『声明式+跨平台』的抽象：你只描述状态对应的 UI，diff 算法帮你算出最小更新。真正的收益是可维护性和心智模型，不是性能银弹。",
        points: ["声明式抽象", "diff 最小更新", "非性能银弹"],
      },
      {
        q: "谈谈前端为什么需要打包工具？",
        a: "解决模块依赖管理、ES6+/JSX 转译、代码分割与按需加载、Tree-shaking、资源处理与压缩。本质是把工程化能力带进前端。",
      },
    ],
    tags: ["数据驱动", "组件化", "工程化"],
  },
  {
    id: "redis",
    index: "10",
    title: "Redis",
    trigger: "数据库压力大",
    era: "2009–",
    bottleneck:
      "读多写少的场景下，热点数据反复打到数据库，磁盘 IO 和连接成为瓶颈，响应变慢。数据库被『读』拖垮，但这些数据其实变化不频繁。",
    ideas: [
      { name: "加数据库从库", desc: "读写分离能分担，但仍受磁盘和主从延迟限制。", verdict: "partial" },
      { name: "本地缓存", desc: "进程内缓存快，但多实例间不一致、容量受限。", verdict: "partial" },
      { name: "分布式内存缓存(Redis)", desc: "独立的内存 KV，多服务共享、数据结构丰富。", verdict: "accepted" },
    ],
    solution:
      "Redis 把热点数据放内存，用集中式缓存挡在数据库前面。读请求先走缓存，命中即返回。还顺带解决了分布式锁、计数器、排行榜、会话共享等。代价是要处理缓存一致性与穿透/击穿/雪崩。",
    essence: "用内存缓存把热点读挡在数据库之前。",
    questions: [
      {
        q: "缓存穿透、击穿、雪崩分别是什么？怎么解决？",
        a: "穿透=查不存在的 key（布隆过滤器/空值缓存）；击穿=热点 key 过期瞬间高并发（互斥锁/逻辑过期/永不过期）；雪崩=大量 key 同时过期（过期时间加随机、多级缓存）。",
        points: ["穿透→布隆/空值", "击穿→互斥锁", "雪崩→随机过期"],
      },
      {
        q: "缓存和数据库如何保证一致性？",
        a: "常用 Cache Aside：读时回填，写时先更新库再删缓存。强一致难做，通常追求最终一致，配合延迟双删、订阅 binlog(canal) 异步失效。",
      },
    ],
    tags: ["缓存", "内存", "最终一致"],
  },
  {
    id: "mq",
    index: "11",
    title: "MQ 消息队列",
    trigger: "同步调用太慢",
    era: "2010s",
    bottleneck:
      "下单要同步调库存、积分、短信、风控……一环慢则全链路慢，一环挂则整体挂。峰值流量直接砸到每个下游，系统被瞬时高并发压垮。",
    ideas: [
      { name: "同步串行调用", desc: "逻辑直观但耦合强、延迟叠加、无法削峰。", verdict: "rejected" },
      { name: "线程池异步", desc: "本地异步能提速，但跨服务、可靠性、堆积仍无解。", verdict: "partial" },
      { name: "消息队列", desc: "生产者发消息即返回，消费者异步处理，中间件缓冲。", verdict: "accepted" },
    ],
    solution:
      "MQ 带来三大能力：解耦（上下游只认消息）、异步（发完即走、提升响应）、削峰（队列缓冲突发流量）。代价是引入消息丢失、重复、顺序、堆积等新问题，需要幂等和可靠投递来兜底。",
    essence: "用异步消息实现解耦、削峰、最终一致。",
    questions: [
      {
        q: "MQ 如何保证消息不丢失、不重复消费？",
        a: "不丢：生产者确认+持久化+消费者手动 ack。不重复：消费端做幂等（唯一键/去重表/状态机）。二者结合达到『至少一次+幂等=有效一次』。",
        points: ["生产/存储/消费三段确认", "消费幂等", "有效一次语义"],
      },
      {
        q: "MQ 消息堆积怎么办？",
        a: "先定位是生产突增还是消费变慢；扩容消费者、提高并发、优化消费逻辑，必要时临时转储或降级；根治要做限流和容量规划。",
      },
    ],
    tags: ["解耦", "削峰", "幂等"],
  },
  {
    id: "microservice",
    index: "12",
    title: "微服务",
    trigger: "单体系统太大",
    era: "2014–",
    bottleneck:
      "单体应用几十万行，任何小改动都要整体编译、整体部署、整体回滚；一个模块内存泄漏拖垮全站；团队都在一个代码库里互相踩脚，无法独立发布。",
    ideas: [
      { name: "垂直拆分单体", desc: "按业务拆几个大应用，缓解但边界仍粗。", verdict: "partial" },
      { name: "SOA/ESB", desc: "服务化但中心化总线成瓶颈，重量级。", verdict: "partial" },
      { name: "微服务", desc: "按业务能力拆成独立部署的小服务，去中心化通信。", verdict: "accepted" },
    ],
    solution:
      "微服务按业务边界（领域）拆分成独立部署、独立数据库、独立扩缩容的小服务，团队自治、故障隔离。但它把单体内的函数调用变成了网络调用，引出注册发现、配置、网关、分布式事务等一整套新问题。",
    essence: "用独立部署换来自治与隔离，代价是分布式复杂度。",
    questions: [
      {
        q: "微服务拆分的原则？拆过头有什么坏处？",
        a: "按业务领域(DDD 限界上下文)拆、高内聚低耦合、单一职责、数据库隔离。拆过细会带来分布式事务、链路变长、运维和联调成本剧增，得不偿失。",
        points: ["按领域边界拆", "数据隔离", "警惕过度拆分"],
      },
      {
        q: "微服务下如何保证数据一致性？",
        a: "放弃强一致，用最终一致：可靠消息、本地消息表、Saga、TCC 等分布式事务方案，配合幂等和补偿。",
      },
    ],
    tags: ["服务拆分", "自治", "分布式"],
  },
  {
    id: "registry",
    index: "13",
    title: "注册中心",
    trigger: "服务太多",
    era: "2014–",
    bottleneck:
      "服务实例动态扩缩、随时上下线，IP 端口不断变化。调用方无法把地址写死在配置里，否则每次扩容、宕机都要改配置重启。",
    ideas: [
      { name: "硬编码地址/配置文件", desc: "简单但无法应对动态实例，运维噩梦。", verdict: "rejected" },
      { name: "DNS", desc: "能解析但更新慢、无健康状态、粒度粗。", verdict: "partial" },
      { name: "注册中心", desc: "服务启动即注册、下线即摘除，消费者动态发现。", verdict: "accepted" },
    ],
    solution:
      "注册中心(Nacos/Eureka/Consul/ZooKeeper)让服务自注册、自摘除，并做健康检查。消费者从注册中心拉取可用实例列表并本地缓存，配合负载均衡选一个调用。地址不再写死，弹性扩缩成为可能。",
    essence: "让服务地址从『静态配置』变成『动态发现』。",
    questions: [
      {
        q: "注册中心选型 CP 还是 AP？为什么？",
        a: "ZooKeeper 是 CP，保证一致但选举时不可用；Eureka/Nacos(AP 模式)优先可用，允许短暂不一致。服务发现更看重可用性，通常 AP 更合适——拿到略旧的列表也能调。",
        points: ["CAP 取舍", "发现场景偏 AP", "健康检查+本地缓存"],
      },
    ],
    tags: ["服务发现", "健康检查", "CAP"],
  },
  {
    id: "config",
    index: "14",
    title: "配置中心",
    trigger: "配置太多",
    era: "2015–",
    bottleneck:
      "几十个服务、多套环境，配置散落在各自的 properties 里。改一个开关要逐个改、逐个重启；灰度、回滚、敏感信息管理全靠人肉，极易出错。",
    ideas: [
      { name: "本地配置文件", desc: "改动需重新打包/重启，无法动态生效。", verdict: "rejected" },
      { name: "数据库存配置", desc: "能集中但缺版本、推送、灰度能力。", verdict: "partial" },
      { name: "配置中心", desc: "集中管理+动态推送+版本回滚+环境隔离。", verdict: "accepted" },
    ],
    solution:
      "配置中心(Nacos/Apollo/Consul)把配置集中托管，支持热更新（改完实时推送、无需重启）、多环境隔离、灰度发布、版本回滚和权限审计。配置从『代码的一部分』变成『可运营的开关』。",
    essence: "配置集中化+动态化，改开关不再重启。",
    questions: [
      {
        q: "配置中心如何实现动态刷新？",
        a: "客户端与服务端建立长轮询/长连接，配置变更时服务端推送（或客户端感知），触发本地刷新与 @RefreshScope Bean 重建。Apollo 长轮询、Nacos 长连接。",
        points: ["长轮询/长连接", "推送后热刷新", "灰度+回滚"],
      },
    ],
    tags: ["集中配置", "热更新", "灰度"],
  },
  {
    id: "loadbalance",
    index: "15",
    title: "负载均衡",
    trigger: "流量太大",
    era: "2000s–",
    bottleneck:
      "单台服务器处理能力有限，流量一大就打满 CPU、连接数。加机器容易，但如何把海量请求均匀分到多台、并在某台宕机时自动绕开？",
    ideas: [
      { name: "客户端记多个地址", desc: "调用方自己轮询，逻辑分散、难统一治理。", verdict: "partial" },
      { name: "DNS 轮询", desc: "粗粒度分流，无健康感知、缓存导致失衡。", verdict: "partial" },
      { name: "负载均衡器", desc: "四层/七层统一入口，按策略分发+健康剔除。", verdict: "accepted" },
    ],
    solution:
      "负载均衡把请求按策略（轮询、加权、最少连接、一致性哈希）分发到后端集群，并剔除不健康节点。分服务端(Nginx/LVS/F5、四层/七层)与客户端(Ribbon/LoadBalancer)两类。它是水平扩展真正落地的关键。",
    essence: "把流量均匀摊到集群，并自动绕开故障节点。",
    questions: [
      {
        q: "四层和七层负载均衡的区别？",
        a: "四层(LVS)基于 IP+端口转发，性能高、不看内容；七层(Nginx)能解析 HTTP，按 URL/Header/Cookie 做智能路由、灰度、鉴权，更灵活但开销略大。常组合使用。",
        points: ["L4=IP端口快", "L7=看内容灵活", "常组合"],
      },
      {
        q: "常见负载均衡算法？一致性哈希解决什么？",
        a: "轮询、加权轮询、最少连接、随机、IP/一致性哈希。一致性哈希在节点增减时只影响少量 key 的归属，适合缓存/有状态场景，减少数据迁移。",
      },
    ],
    tags: ["水平扩展", "分发策略", "高可用"],
  },
  {
    id: "gateway",
    index: "16",
    title: "API Gateway",
    trigger: "服务入口太多",
    era: "2016–",
    bottleneck:
      "微服务几十上百个，客户端要知道每个服务的地址；鉴权、限流、日志、跨域这些横切逻辑在每个服务里重复实现，且暴露内部拓扑不安全。",
    ideas: [
      { name: "客户端直连各服务", desc: "耦合内部结构，横切逻辑重复，难治理。", verdict: "rejected" },
      { name: "每服务各自做鉴权限流", desc: "重复且不一致，安全口子多。", verdict: "rejected" },
      { name: "API 网关", desc: "统一入口，集中做路由和横切关注点。", verdict: "accepted" },
    ],
    solution:
      "网关(Spring Cloud Gateway/Kong/APISIX)作为统一入口，把鉴权、限流、熔断、日志、协议转换、路由等横切逻辑集中处理，对外屏蔽内部拓扑。客户端只面对网关，内部服务专注业务。",
    essence: "统一入口，集中承载横切关注点。",
    questions: [
      {
        q: "网关和负载均衡的区别？",
        a: "负载均衡关注『把请求分到哪台』（流量分发）；网关关注『请求进来先做什么』（鉴权、限流、路由、协议转换等业务/横切逻辑）。网关内部通常也用负载均衡。",
        points: ["LB=分发", "网关=横切治理", "网关含 LB"],
      },
    ],
    tags: ["统一入口", "横切关注点", "限流鉴权"],
  },
  {
    id: "docker",
    index: "17",
    title: "Docker",
    trigger: "容器环境不一致",
    era: "2013–",
    bottleneck:
      "『在我机器上是好的』。开发、测试、生产的 OS、依赖、版本各不相同，部署靠一长串手册，环境漂移导致的诡异 Bug 层出不穷。",
    ideas: [
      { name: "部署手册/脚本", desc: "靠文档对齐环境，仍易漂移、难复现。", verdict: "rejected" },
      { name: "虚拟机镜像", desc: "环境一致但笨重，启动慢、占用大。", verdict: "partial" },
      { name: "容器(Docker)", desc: "打包应用+依赖成镜像，共享内核、秒级启动。", verdict: "accepted" },
    ],
    solution:
      "Docker 用镜像把应用和它的全部依赖打包成不可变产物，基于 Linux Namespace/Cgroups 做进程级隔离，共享宿主内核所以轻量、秒级启动。一次构建、处处运行，彻底消灭环境差异。",
    essence: "把应用和环境一起打包成不可变镜像。",
    questions: [
      {
        q: "Docker 和虚拟机的区别？为什么更轻？",
        a: "VM 虚拟化硬件、每台带完整 OS，重；容器共享宿主内核，用 Namespace 做隔离、Cgroups 做资源限制，只是被隔离的进程，故镜像小、启动快、密度高。",
        points: ["共享内核 vs 独立 OS", "Namespace 隔离", "Cgroups 限额"],
      },
    ],
    tags: ["镜像", "隔离", "不可变"],
  },
  {
    id: "k8s",
    index: "18",
    title: "Kubernetes",
    trigger: "容器太多",
    era: "2015–",
    bottleneck:
      "有了容器，但成百上千个容器散在几十台机器上：哪台放哪个、挂了谁重启、怎么扩缩、怎么滚动升级、怎么服务发现和网络互通——手工根本管不过来。",
    ideas: [
      { name: "脚本+手工编排", desc: "小规模能撑，规模一大不可维护、易出错。", verdict: "rejected" },
      { name: "Docker Compose/Swarm", desc: "单机或小集群可用，大规模能力和生态不足。", verdict: "partial" },
      { name: "Kubernetes", desc: "声明式编排，控制器持续调谐到期望状态。", verdict: "accepted" },
    ],
    solution:
      "K8s 用声明式 API：你描述『期望状态』(几个副本、什么镜像、多少资源)，控制器不断调谐实际状态向期望靠拢——自动调度、自愈、扩缩、滚动升级、服务发现。它成了容器编排的事实标准。",
    essence: "声明期望状态，让控制器持续自动调谐。",
    questions: [
      {
        q: "K8s 的核心思想『声明式+控制器』是什么？",
        a: "你声明期望状态(如 Deployment 要 3 副本)，各控制器通过 list-watch 感知实际状态，与期望做 diff 并驱动其收敛(reconcile)。这带来了自愈和幂等的运维。",
        points: ["声明期望态", "控制循环 reconcile", "自愈"],
      },
      {
        q: "Pod、Deployment、Service 各是什么？",
        a: "Pod 是最小调度单元(一组共享网络的容器)；Deployment 管理 Pod 的副本与滚动更新；Service 为一组 Pod 提供稳定虚拟 IP 和负载均衡，解耦调用方与 Pod 变化。",
      },
    ],
    tags: ["编排", "声明式", "自愈"],
  },
  {
    id: "cloudnative",
    index: "19",
    title: "云原生",
    trigger: "运维复杂",
    era: "2018–",
    bottleneck:
      "微服务+容器+K8s 之后，可观测性、弹性、发布、服务治理、韧性成了系统性难题。每个团队各自造轮子，稳定性和效率参差不齐。",
    ideas: [
      { name: "各团队自建体系", desc: "能用但重复造轮子、标准不一。", verdict: "rejected" },
      { name: "SDK 侵入式治理", desc: "把治理逻辑塞进业务代码，升级困难、多语言难统一。", verdict: "partial" },
      { name: "云原生体系", desc: "以 K8s 为底座，DevOps/服务网格/可观测/Serverless。", verdict: "accepted" },
    ],
    solution:
      "云原生是一套方法论：以容器+K8s 为底座，围绕不可变基础设施、声明式 API、微服务、服务网格(把治理下沉到 Sidecar)、可观测性(Metrics/Logging/Tracing)、CI/CD 与弹性，构建可快速迭代、韧性强、可弹性伸缩的系统。",
    essence: "以 K8s 为底座，让系统天生弹性、可观测、可快速演进。",
    questions: [
      {
        q: "什么是服务网格(Service Mesh)？解决什么问题？",
        a: "把限流、熔断、重试、mTLS、灰度等治理逻辑从业务代码下沉到 Sidecar 代理(如 Istio+Envoy)，业务无感、跨语言统一治理、可独立升级。代价是多一跳和运维复杂度。",
        points: ["治理下沉 Sidecar", "业务无侵入", "多语言统一"],
      },
      {
        q: "可观测性的三大支柱？",
        a: "Metrics(指标，看趋势与告警)、Logging(日志，看细节)、Tracing(链路追踪，看一次请求跨服务的全路径)。三者互补定位问题。",
      },
    ],
    tags: ["服务网格", "可观测性", "弹性"],
  },
  {
    id: "llm-agent",
    index: "20",
    title: "LLM + Agent",
    trigger: "软件不会思考",
    era: "2023–",
    bottleneck:
      "过去的软件只能执行写死的规则，无法理解自然语言、无法推理和自主决策。面对开放、模糊的任务，传统 if-else 和规则引擎无能为力。",
    ideas: [
      { name: "规则引擎/专家系统", desc: "靠人工规则，覆盖不全、无法泛化。", verdict: "rejected" },
      { name: "单次 Prompt 调用 LLM", desc: "能理解语言，但不能用工具、不能多步执行。", verdict: "partial" },
      { name: "LLM + Agent", desc: "LLM 做大脑，配工具、记忆、规划，自主完成任务。", verdict: "accepted" },
    ],
    solution:
      "LLM 提供语言理解与推理，Agent 在其外面套上『感知-规划-行动-反思』循环：让模型调用工具(Function Calling)、检索知识(RAG)、记忆上下文、拆解并执行多步任务。软件第一次拥有了处理开放任务的『思考』能力。",
    essence: "让模型做大脑、工具做手脚，软件开始自主完成任务。",
    questions: [
      {
        q: "Agent 和单次调用 LLM 的本质区别？",
        a: "单次调用是『输入→输出』一锤子；Agent 是带循环的自治体：能规划、调用工具获取外部能力、观察结果、反思纠错、多步迭代直到完成目标。核心是『行动-观察』闭环。",
        points: ["规划+工具+记忆", "行动-观察闭环", "多步自治"],
      },
      {
        q: "RAG 解决 LLM 的什么问题？",
        a: "解决知识过时、幻觉、私域知识缺失：先检索相关文档，把结果拼进上下文再让模型回答，让生成有据可依、可溯源、可更新，且无需重训模型。",
      },
    ],
    tags: ["推理", "工具调用", "自治循环"],
  },
];

// ────────────────────────────────────────────────────────────────
// 细分：计算机底层演化史
// ────────────────────────────────────────────────────────────────

const lowLevelStages: EvolutionStage[] = [
  {
    id: "cpu",
    index: "01",
    title: "CPU",
    trigger: "需要自动计算",
    era: "1940s–",
    bottleneck: "人力计算太慢，需要一个能按指令自动执行运算的核心部件。",
    ideas: [
      { name: "固定功能电路", desc: "只能做一种运算，换任务要重接线。", verdict: "rejected" },
      { name: "存储程序(冯诺依曼)", desc: "指令和数据都存内存，CPU 取指-译码-执行。", verdict: "accepted" },
    ],
    solution:
      "冯诺依曼架构：CPU 通过『取指→译码→执行→写回』循环执行存于内存的指令。后续用流水线、多核、缓存不断提速。",
    essence: "把『程序』变成可存储、可执行的指令流。",
    questions: [
      {
        q: "CPU 流水线和乱序执行为什么能提速？",
        a: "流水线让取指/译码/执行等阶段并行(像工厂流水线)；乱序执行让无依赖的指令提前跑，填满等待空档，提高吞吐。分支预测则减少流水线停顿。",
        points: ["指令级并行", "填满空档", "分支预测"],
      },
    ],
    tags: ["冯诺依曼", "指令周期"],
  },
  {
    id: "memory",
    index: "02",
    title: "内存与缓存",
    trigger: "CPU 等数据太久",
    era: "1960s–",
    bottleneck: "CPU 越来越快，但内存访问慢几十上百倍，CPU 大量时间在空等数据。",
    ideas: [
      { name: "只用主存", desc: "简单但速度鸿沟巨大，CPU 严重空转。", verdict: "rejected" },
      { name: "多级缓存(L1/L2/L3)", desc: "利用局部性把热点数据放近 CPU。", verdict: "accepted" },
    ],
    solution:
      "在 CPU 和主存间加多级 Cache，利用时间/空间局部性缓存热点。命中就快、未命中才访主存，用金字塔存储层次弥补速度鸿沟。",
    essence: "用局部性和分级缓存，弥补 CPU 与内存的速度鸿沟。",
    questions: [
      {
        q: "什么是局部性原理？和缓存什么关系？",
        a: "时间局部性(刚访问的还会访问)、空间局部性(访问了就可能访问相邻)。缓存正是靠它预取和保留热点数据，命中率高才有效。写代码顺序访问数组比乱序快也源于此。",
        points: ["时间/空间局部性", "缓存命中率", "缓存行"],
      },
    ],
    tags: ["局部性", "缓存层次"],
  },
  {
    id: "os",
    index: "03",
    title: "操作系统",
    trigger: "程序要共享硬件",
    era: "1960s–",
    bottleneck: "多个程序想同时用一台机器的 CPU、内存、外设，直接裸操作硬件会互相冲突、彼此破坏。",
    ideas: [
      { name: "单程序独占", desc: "简单但硬件利用率低，无法多任务。", verdict: "rejected" },
      { name: "操作系统抽象+隔离", desc: "OS 统一管理硬件，提供进程、虚拟内存、系统调用。", verdict: "accepted" },
    ],
    solution:
      "操作系统作为硬件之上的管理层：用进程抽象 CPU、用虚拟内存抽象物理内存、用文件抽象存储、用系统调用提供受控入口，并靠内核态/用户态隔离保护。",
    essence: "抽象并复用硬件，用隔离保护彼此不干扰。",
    questions: [
      {
        q: "用户态和内核态为什么要分？系统调用如何切换？",
        a: "为安全和稳定：用户程序不能直接碰硬件和特权指令。需要时通过系统调用(软中断/syscall 指令)陷入内核态，由 OS 代为执行再返回，形成受控边界。",
        points: ["特权隔离", "系统调用陷入", "上下文切换有成本"],
      },
    ],
    tags: ["抽象", "隔离", "系统调用"],
  },
  {
    id: "process",
    index: "04",
    title: "进程",
    trigger: "任务要相互隔离",
    era: "1960s–",
    bottleneck: "多个任务同时运行，一个崩了不能影响别人，各自的内存不能互相看见和踩踏。",
    ideas: [
      { name: "共享地址空间", desc: "任务间无隔离，一个越界写就全崩。", verdict: "rejected" },
      { name: "进程+独立地址空间", desc: "每进程独立虚拟地址空间，资源隔离。", verdict: "accepted" },
    ],
    solution:
      "进程是资源分配的基本单位，拥有独立的虚拟地址空间和资源。互相隔离带来稳定与安全，跨进程通信需专门的 IPC(管道、共享内存、socket 等)。",
    essence: "以独立地址空间为边界，实现资源隔离。",
    questions: [
      {
        q: "进程和线程的区别？",
        a: "进程是资源分配单位、有独立地址空间，隔离好但切换重、通信贵；线程是 CPU 调度单位、共享进程内存，切换轻、通信易但一个崩可能拖垮整进程。",
        points: ["资源 vs 调度单位", "隔离 vs 共享", "切换成本"],
      },
    ],
    tags: ["地址空间", "隔离", "IPC"],
  },
  {
    id: "thread",
    index: "05",
    title: "线程",
    trigger: "进程切换太重",
    era: "1990s–",
    bottleneck: "进程创建和切换开销大、通信要走 IPC。想在同一任务内并发做多件事(如一边下载一边渲染)，用进程太笨重。",
    ideas: [
      { name: "多进程并发", desc: "隔离好但开销大、共享数据难。", verdict: "partial" },
      { name: "线程", desc: "进程内多个执行流，共享内存、切换轻。", verdict: "accepted" },
    ],
    solution:
      "线程是进程内的执行流，共享地址空间，创建/切换更轻、通信直接读写共享内存。代价是要用锁、原子、内存屏障处理竞态，带来并发编程的复杂度。",
    essence: "进程内轻量并发，代价是共享数据的同步难题。",
    questions: [
      {
        q: "线程安全问题的根源？如何解决？",
        a: "根源是多个线程并发读写共享可变状态导致竞态。解决：加锁(互斥)、无锁(CAS/原子)、不可变、线程封闭(ThreadLocal)、或用消息传递避免共享。",
        points: ["共享可变状态", "锁/CAS/不可变", "死锁警惕"],
      },
    ],
    tags: ["并发", "共享内存", "同步"],
  },
  {
    id: "jvm",
    index: "06",
    title: "JVM",
    trigger: "要跨平台运行",
    era: "1995–",
    bottleneck: "C/C++ 编译产物绑定平台，换个 OS/架构就要重新编译。想『一次编写，到处运行』。",
    ideas: [
      { name: "各平台重新编译", desc: "可行但成本高、分发难。", verdict: "rejected" },
      { name: "虚拟机+字节码", desc: "编译成中间字节码，各平台 JVM 解释/JIT 执行。", verdict: "accepted" },
    ],
    solution:
      "JVM 定义统一的字节码，源码先编译成字节码，再由各平台的 JVM 解释执行并用 JIT 热点编译成机器码。屏蔽平台差异，还自带内存管理和 GC。",
    essence: "用字节码+虚拟机，把平台差异挡在下面。",
    questions: [
      {
        q: "JVM 运行时内存区域有哪些？",
        a: "线程共享的堆(对象)和方法区/元空间(类元数据)；线程私有的虚拟机栈(栈帧)、本地方法栈、程序计数器。堆是 GC 主战场，栈溢出与堆溢出成因不同。",
        points: ["堆/方法区共享", "栈/PC 私有", "GC 管堆"],
      },
      {
        q: "JIT 是什么？为什么 Java 不算慢？",
        a: "JIT 把热点字节码在运行时编译成本地机器码并做内联、逃逸分析等优化，长期运行的服务性能接近原生，兼具跨平台与高性能。",
      },
    ],
    tags: ["字节码", "跨平台", "JIT"],
  },
  {
    id: "v8",
    index: "07",
    title: "V8 引擎",
    trigger: "JS 太慢",
    era: "2008–",
    bottleneck: "JavaScript 早期是解释执行的『玩具脚本』，性能差，撑不起复杂的 Web 应用和后端(Node)。",
    ideas: [
      { name: "纯解释执行", desc: "启动快但运行慢，重逻辑吃力。", verdict: "rejected" },
      { name: "JIT 编译(V8)", desc: "热点代码即时编译成机器码+隐藏类优化。", verdict: "accepted" },
    ],
    solution:
      "V8 引入 JIT：先快速解释(Ignition)，热点再优化编译(TurboFan)，配合隐藏类和内联缓存优化属性访问。JS 性能飞跃，直接催生了 Node.js 让 JS 进入服务端。",
    essence: "用 JIT 把脚本语言拉进高性能时代。",
    questions: [
      {
        q: "Node.js 的事件循环和单线程模型？",
        a: "V8 单线程执行 JS，靠 libuv 的事件循环+线程池处理 IO：发起异步 IO 后不阻塞，完成后回调入队。适合高并发 IO 密集，CPU 密集任务会阻塞循环需另辟线程/进程。",
        points: ["单线程+事件循环", "非阻塞 IO", "CPU 密集是软肋"],
      },
    ],
    tags: ["JIT", "事件循环", "Node"],
  },
  {
    id: "gc",
    index: "08",
    title: "GC 垃圾回收",
    trigger: "手动管内存易错",
    era: "1960s / 现代成熟",
    bottleneck: "手动 malloc/free 极易内存泄漏、悬垂指针、二次释放，是无尽 Bug 与安全漏洞的来源。",
    ideas: [
      { name: "手动管理", desc: "极致可控但极易出错，心智负担重。", verdict: "partial" },
      { name: "引用计数", desc: "及时回收但处理不了循环引用、计数有开销。", verdict: "partial" },
      { name: "可达性分析+分代", desc: "从 GC Root 追踪存活对象，按对象年龄分代回收。", verdict: "accepted" },
    ],
    solution:
      "现代 GC 用可达性分析(从 GC Root 出发标记存活)判定垃圾，配合分代假设(大多对象朝生夕死)分区回收，并演进出 G1/ZGC 等低停顿并发收集器，把 STW 压到毫秒级。",
    essence: "用可达性分析+分代，把内存管理自动化。",
    questions: [
      {
        q: "如何判断对象可回收？为什么不用引用计数？",
        a: "主流用可达性分析：从 GC Roots(栈引用、静态变量等)出发遍历，不可达即垃圾。引用计数简单及时，但无法处理循环引用，且每次赋值都要维护计数，主流 JVM 不采用。",
        points: ["可达性分析", "GC Roots", "循环引用问题"],
      },
      {
        q: "为什么要分代回收？",
        a: "基于弱分代假设：绝大多数对象很快死亡。年轻代用复制算法频繁快速回收，老年代对象存活久用标记-整理/清除少回收，兼顾吞吐与停顿。",
      },
    ],
    tags: ["可达性分析", "分代", "低停顿"],
  },
];

// ────────────────────────────────────────────────────────────────
// 细分：数据库演化史
// ────────────────────────────────────────────────────────────────

const databaseStages: EvolutionStage[] = [
  {
    id: "file-storage",
    index: "01",
    title: "文件存储",
    trigger: "要持久化数据",
    era: "早期",
    bottleneck: "数据要断电不丢，最朴素的办法是写文件。但查询靠全文件扫描，并发写会互相覆盖，无结构、无关系。",
    ideas: [
      { name: "纯文本文件", desc: "简单直观，但检索、并发、一致性全无。", verdict: "rejected" },
      { name: "结构化存储引擎", desc: "定义记录格式+索引+并发控制。", verdict: "accepted" },
    ],
    solution: "从裸文件走向有格式、有索引、有并发控制的存储引擎，这是数据库的雏形——把『存得下』升级为『查得快、改得对』。",
    essence: "从『能存』迈向『能高效检索与并发修改』。",
    questions: [
      {
        q: "为什么不直接用文件当数据库？",
        a: "文件缺乏高效检索(要全扫)、并发控制(易冲突)、事务(无原子性)、关系表达和崩溃恢复。数据库正是为解决这些而生。",
      },
    ],
    tags: ["持久化", "存储引擎"],
  },
  {
    id: "bplus-tree",
    index: "02",
    title: "B+ 树",
    trigger: "磁盘查找太慢",
    era: "1970s–",
    bottleneck: "磁盘随机 IO 极慢，二叉树/哈希在磁盘上要么太高(IO 次数多)，要么不支持范围查询。",
    ideas: [
      { name: "二叉搜索树", desc: "内存快，但磁盘上树太高，每层一次 IO 太多。", verdict: "rejected" },
      { name: "哈希索引", desc: "等值查询 O(1)，但不支持范围和排序。", verdict: "partial" },
      { name: "B+ 树", desc: "多叉矮胖树、数据全在叶子且链表相连。", verdict: "accepted" },
    ],
    solution:
      "B+ 树用多叉降低树高(通常 3~4 层即可存千万行)，减少磁盘 IO；数据只在叶子节点并用链表串联，天然支持高效范围扫描和排序。成为关系型数据库索引的主流结构。",
    essence: "矮胖多叉+叶子链表，为磁盘范围查询而生。",
    questions: [
      {
        q: "为什么 MySQL 索引用 B+ 树而不是 B 树或哈希？",
        a: "对比 B 树：B+ 树非叶子只存键、更矮更胖(IO 更少)，且叶子链表支持范围查询。对比哈希：哈希不支持范围和排序。综合磁盘特性，B+ 树最优。",
        points: ["矮胖降 IO", "叶子链表范围快", "哈希不支持范围"],
      },
    ],
    tags: ["索引结构", "磁盘IO", "范围查询"],
  },
  {
    id: "index",
    index: "03",
    title: "索引",
    trigger: "查询要更快",
    era: "—",
    bottleneck: "有了 B+ 树引擎，但如果只对主键有序，按其他列查询仍要全表扫描，海量数据下慢得无法接受。",
    ideas: [
      { name: "全表扫描", desc: "无需维护，但数据量大时线性慢。", verdict: "rejected" },
      { name: "二级索引+覆盖索引", desc: "为查询列建索引，甚至让索引直接覆盖查询。", verdict: "accepted" },
    ],
    solution:
      "为高频查询列建立二级索引(独立 B+ 树，叶子存主键)，把全表扫描变成索引查找。理解回表、覆盖索引、最左前缀、索引下推，是 SQL 调优的核心。",
    essence: "用空间和写入代价，换查询的对数级加速。",
    questions: [
      {
        q: "什么是回表和覆盖索引？最左前缀原则？",
        a: "二级索引查到主键再回聚簇索引取整行叫回表；若索引已包含所需列则无需回表即『覆盖索引』。联合索引(a,b,c)按最左前缀匹配，跳过 a 直接查 b 用不上索引。",
        points: ["回表=二次查找", "覆盖索引免回表", "最左前缀"],
      },
    ],
    tags: ["二级索引", "覆盖索引", "调优"],
  },
  {
    id: "transaction",
    index: "04",
    title: "事务",
    trigger: "并发改数据出错",
    era: "—",
    bottleneck: "转账要么都成功要么都失败，中途崩溃不能只扣款不到账；多个操作并发时还会互相干扰产生脏数据。",
    ideas: [
      { name: "无事务", desc: "并发下脏读、丢更新，数据错乱。", verdict: "rejected" },
      { name: "ACID 事务", desc: "用原子性、一致性、隔离性、持久性约束一组操作。", verdict: "accepted" },
    ],
    solution:
      "事务保证 ACID：一组操作原子执行(全成或全败)、崩溃可恢复(redo/undo 日志)、并发下按隔离级别互不干扰。是数据正确性的基石。",
    essence: "把一组操作变成不可分割、可恢复的整体。",
    questions: [
      {
        q: "ACID 分别靠什么实现？",
        a: "原子性靠 undo log 回滚；持久性靠 redo log 崩溃恢复；隔离性靠锁+MVCC；一致性是前三者+业务约束共同保证的目标。",
        points: ["A→undo", "D→redo", "I→锁/MVCC"],
      },
      {
        q: "四种隔离级别与并发问题？",
        a: "读未提交(脏读)、读已提交(不可重复读)、可重复读(幻读，MySQL 默认+间隙锁缓解)、串行化(全避免但慢)。级别越高越安全越慢。",
      },
    ],
    tags: ["ACID", "隔离级别", "日志"],
  },
  {
    id: "mvcc",
    index: "05",
    title: "MVCC",
    trigger: "读写互相阻塞",
    era: "—",
    bottleneck: "为隔离而加读写锁，会让读阻塞写、写阻塞读，高并发下吞吐骤降。但大部分场景读远多于写。",
    ideas: [
      { name: "读写加锁", desc: "正确但读写互斥，并发差。", verdict: "partial" },
      { name: "多版本(MVCC)", desc: "写生成新版本、读旧版本快照，读写不互斥。", verdict: "accepted" },
    ],
    solution:
      "MVCC 为数据保留多个版本：写操作生成新版本(靠 undo log 串成版本链)，读操作按事务的一致性视图(Read View)读取合适的快照版本。实现『读不加锁、读写不冲突』，大幅提升并发。",
    essence: "用多版本快照，让读写并发而不互相阻塞。",
    questions: [
      {
        q: "MVCC 如何工作？Read View 是什么？",
        a: "每行有隐藏的事务版本号，undo log 组成版本链。读时创建 Read View 记录活跃事务，据此判断某版本对当前事务是否可见，从而读到一致快照，无需加读锁。",
        points: ["版本链+undo", "Read View 可见性", "快照读不加锁"],
      },
    ],
    tags: ["多版本", "快照读", "并发"],
  },
  {
    id: "sharding",
    index: "06",
    title: "分库分表",
    trigger: "单库扛不住",
    era: "2010s",
    bottleneck: "单表上亿行，B+ 树变高、索引变大、单机容量和 IOPS 见顶，写入和查询都变慢，单点也是瓶颈。",
    ideas: [
      { name: "升级硬件(垂直扩展)", desc: "简单但有物理天花板且成本陡增。", verdict: "partial" },
      { name: "读写分离", desc: "分担读压力，但写和容量仍单点。", verdict: "partial" },
      { name: "水平分库分表", desc: "按分片键把数据散到多库多表。", verdict: "accepted" },
    ],
    solution:
      "按分片键(如用户 ID 取模/范围/一致性哈希)把数据水平拆到多个库表，分散容量和读写压力。代价是跨分片查询、分布式事务、全局唯一 ID、扩容迁移等新难题。",
    essence: "水平拆分突破单机上限，代价是分布式复杂度。",
    questions: [
      {
        q: "分库分表后带来哪些问题？如何应对？",
        a: "跨分片 join/聚合难(尽量避免、用冗余或搜索引擎)、分布式事务(最终一致)、全局唯一 ID(雪花算法/号段)、分页与排序复杂、扩容数据迁移(一致性哈希/双写)。",
        points: ["分片键选择", "跨片查询痛点", "全局 ID"],
      },
    ],
    tags: ["水平扩展", "分片", "分布式"],
  },
  {
    id: "newsql",
    index: "07",
    title: "NewSQL",
    trigger: "既要扩展又要事务",
    era: "2015–",
    bottleneck: "分库分表牺牲了跨节点事务和 SQL 便利；NoSQL 能扩展却放弃了强一致和关系能力。鱼与熊掌想兼得。",
    ideas: [
      { name: "手工分库分表", desc: "扩展但运维复杂、无分布式事务。", verdict: "partial" },
      { name: "NoSQL", desc: "易扩展、高可用，但弱一致、少事务与 SQL。", verdict: "partial" },
      { name: "NewSQL", desc: "分布式架构下同时提供 SQL+强一致+水平扩展。", verdict: "accepted" },
    ],
    solution:
      "NewSQL(TiDB/CockroachDB/Spanner)用分布式共识(Raft/Paxos)+分片，在保留 SQL 和 ACID 的同时实现水平扩展和高可用，让应用无需手工分库分表就能弹性扩容。",
    essence: "在分布式底座上同时给你 SQL、强一致与弹性扩展。",
    questions: [
      {
        q: "NewSQL 如何在分布式下保证强一致？",
        a: "数据分片(Region)多副本，用 Raft/Paxos 共识保证副本一致和高可用；跨分片事务用两阶段提交+时间戳(如 Percolator/TSO)实现分布式 ACID。",
        points: ["Raft 多副本", "分布式事务2PC", "全局时钟/TSO"],
      },
    ],
    tags: ["分布式SQL", "共识", "强一致"],
  },
];

// ────────────────────────────────────────────────────────────────
// 细分：前端演化史
// ────────────────────────────────────────────────────────────────

const frontendStages: EvolutionStage[] = [
  {
    id: "html",
    index: "01",
    title: "HTML",
    trigger: "要表达文档结构",
    era: "1991–",
    bottleneck: "网络能传字节，但需要一种标准让浏览器理解『这是标题、这是链接、这是段落』并可跳转。",
    ideas: [
      { name: "纯文本", desc: "能读但无结构、无链接、无法排版。", verdict: "rejected" },
      { name: "超文本标记(HTML)", desc: "用标签描述语义结构+超链接。", verdict: "accepted" },
    ],
    solution: "HTML 用标签描述文档的语义结构和超链接，让浏览器可解析、可渲染、可跳转。它是 Web 的骨架。",
    essence: "用标签为内容赋予结构与语义。",
    questions: [
      {
        q: "什么是语义化 HTML？为什么重要？",
        a: "用 header/nav/article/section 等表意标签而非一堆 div。利于 SEO、无障碍(屏幕阅读器)、可维护性和团队协作。",
      },
    ],
    tags: ["结构", "语义", "超链接"],
  },
  {
    id: "css",
    index: "02",
    title: "CSS",
    trigger: "内容与样式混在一起",
    era: "1996–",
    bottleneck: "早期用 HTML 标签(如 font、table 布局)控制样式，样式和结构耦合，改个配色要动一堆页面。",
    ideas: [
      { name: "标签内联样式", desc: "直接但重复、耦合、难统一维护。", verdict: "rejected" },
      { name: "层叠样式表(CSS)", desc: "样式与结构分离，选择器统一控制。", verdict: "accepted" },
    ],
    solution: "CSS 把表现层从结构中剥离：用选择器统一定义样式，一处修改全局生效。层叠与继承提供了灵活的优先级体系。",
    essence: "让结构与表现分离，样式可统一复用。",
    questions: [
      {
        q: "CSS 盒模型与 BFC 是什么？",
        a: "盒模型=content+padding+border+margin(box-sizing 决定宽度是否含 padding/border)。BFC 是独立布局区域，可解决 margin 重叠、清除浮动、自适应两栏等。",
        points: ["盒模型", "box-sizing", "BFC 隔离"],
      },
    ],
    tags: ["表现分离", "层叠", "布局"],
  },
  {
    id: "javascript",
    index: "03",
    title: "JavaScript",
    trigger: "页面要能交互",
    era: "1995–",
    bottleneck: "HTML+CSS 只能展示静态页面，无法响应用户操作、校验表单、动态改内容。",
    ideas: [
      { name: "服务端往返", desc: "每次交互都回服务器，慢且割裂。", verdict: "rejected" },
      { name: "浏览器脚本(JS)", desc: "在浏览器里直接操作 DOM、响应事件。", verdict: "accepted" },
    ],
    solution: "JavaScript 让页面在浏览器端拥有行为：监听事件、操作 DOM、校验与动画。它把静态文档变成可交互应用。",
    essence: "给页面注入行为，让文档变成应用。",
    questions: [
      {
        q: "解释闭包、原型链和 this 指向？",
        a: "闭包=函数捕获其定义时的作用域变量；原型链=对象沿 __proto__ 查找属性实现继承；this 取决于调用方式(默认/隐式/显式/new/箭头继承外层)。是 JS 三大高频考点。",
        points: ["闭包=捕获作用域", "原型链继承", "this 看调用"],
      },
      {
        q: "事件循环、宏任务与微任务？",
        a: "JS 单线程，同步栈清空后先清空所有微任务(Promise.then)，再取一个宏任务(setTimeout)，如此循环。微任务优先级高于宏任务。",
      },
    ],
    tags: ["交互", "DOM", "事件循环"],
  },
  {
    id: "jquery",
    index: "04",
    title: "jQuery",
    trigger: "浏览器不兼容 + DOM 难用",
    era: "2006–",
    bottleneck: "原生 DOM API 冗长，且各浏览器实现不一致，写兼容代码痛苦不堪。",
    ideas: [
      { name: "各自写兼容", desc: "重复且易漏，维护成本高。", verdict: "rejected" },
      { name: "jQuery 封装", desc: "统一 API+链式操作+屏蔽浏览器差异。", verdict: "accepted" },
    ],
    solution: "jQuery 用简洁的选择器和链式 API 屏蔽浏览器差异，让 DOM 操作和 AJAX 变得优雅。它统治了一个时代，但命令式操作难以支撑大型应用。",
    essence: "抹平浏览器差异，让命令式 DOM 操作变优雅。",
    questions: [
      {
        q: "为什么现代前端逐渐放弃 jQuery？",
        a: "浏览器标准趋于统一(兼容需求下降)、原生 API 增强(querySelector/fetch)、以及大型应用需要数据驱动而非命令式操作 DOM，React/Vue 的声明式模型更可维护。",
      },
    ],
    tags: ["兼容", "命令式", "链式"],
  },
  {
    id: "modularity",
    index: "05",
    title: "模块化",
    trigger: "全局变量污染",
    era: "2009–",
    bottleneck: "所有 JS 都在全局作用域，变量互相覆盖、依赖顺序靠人肉排 script 标签，项目一大就失控。",
    ideas: [
      { name: "IIFE/命名空间", desc: "缓解污染但依赖管理仍手工。", verdict: "partial" },
      { name: "CommonJS/AMD", desc: "运行时模块，Node 用 CommonJS。", verdict: "partial" },
      { name: "ES Module", desc: "语言级标准模块，静态可分析。", verdict: "accepted" },
    ],
    solution: "模块化给每个文件独立作用域并显式声明依赖。从 CommonJS/AMD 到语言级的 ES Module(import/export)，依赖关系清晰、可静态分析、可 Tree-shaking。",
    essence: "用显式依赖和独立作用域，治理全局污染。",
    questions: [
      {
        q: "CommonJS 和 ES Module 的区别？",
        a: "CommonJS 运行时加载、值拷贝、同步、Node 环境；ESM 编译时静态分析、值引用(动态绑定)、支持 Tree-shaking 和顶层 await，是标准方向。",
        points: ["运行时 vs 编译时", "拷贝 vs 引用", "Tree-shaking"],
      },
    ],
    tags: ["作用域", "依赖管理", "ESM"],
  },
  {
    id: "webpack",
    index: "06",
    title: "Webpack",
    trigger: "资源和依赖太复杂",
    era: "2014–",
    bottleneck: "模块多了要处理依赖打包、ES6/JSX 转译、CSS/图片等各类资源、按需加载和压缩——浏览器不认这些，需要构建工具。",
    ideas: [
      { name: "手工拼接脚本", desc: "无法处理转译、按需加载、资源优化。", verdict: "rejected" },
      { name: "打包器(Webpack)", desc: "以模块为单位构建依赖图，loader+plugin 处理一切。", verdict: "accepted" },
      { name: "Vite(ESM+esbuild)", desc: "开发期基于原生 ESM 免打包、极快启动。", verdict: "accepted" },
    ],
    solution: "Webpack 把一切资源当模块，构建依赖图后打包，用 loader 转译、plugin 扩展、代码分割按需加载。后来 Vite 利用浏览器原生 ESM 在开发期免打包、大幅提速。",
    essence: "把工程化构建能力带进前端。",
    questions: [
      {
        q: "Webpack 的构建流程 / loader 和 plugin 区别？",
        a: "从入口出发递归构建依赖图→用 loader 转换各类模块(如 babel-loader 转 JSX)→plugin 在生命周期钩子做更广的任务(如提取 CSS、压缩)→输出 bundle。loader 管转换，plugin 管扩展。",
        points: ["依赖图", "loader 转换", "plugin 扩展"],
      },
      {
        q: "Vite 为什么比 Webpack 开发时快？",
        a: "开发期不打包，直接用浏览器原生 ESM 按需请求模块，用 esbuild(Go 编写)预构建依赖，冷启动和热更新几乎瞬时；生产仍用 Rollup 打包。",
      },
    ],
    tags: ["打包", "构建", "Vite"],
  },
  {
    id: "react-vue",
    index: "07",
    title: "React / Vue",
    trigger: "手动更新 DOM 太乱",
    era: "2013–",
    bottleneck: "大型应用状态多、更新点多，命令式一处处改 DOM 极易遗漏和错乱，状态与视图难以保持同步。",
    ideas: [
      { name: "命令式操作 DOM", desc: "精确但状态一多就失控。", verdict: "rejected" },
      { name: "数据驱动+组件化", desc: "声明 UI=f(state)，组件封装复用。", verdict: "accepted" },
    ],
    solution: "React/Vue 用组件化封装 UI 单元，用数据驱动(状态变→自动重渲染)取代手动 DOM 操作，虚拟 DOM/响应式系统负责算出最小更新。开发者只关心状态。",
    essence: "只描述状态，把 DOM 更新交给框架。",
    questions: [
      {
        q: "React 和 Vue 的核心差异？",
        a: "React 偏函数式、显式(setState/不可变、JSX、手动优化);Vue 偏响应式、自动依赖追踪(数据劫持 Proxy)、模板+SFC，上手更快。理念不同但都是数据驱动+组件化。",
        points: ["显式 vs 响应式", "JSX vs 模板", "同为数据驱动"],
      },
    ],
    tags: ["组件化", "数据驱动", "虚拟DOM"],
  },
  {
    id: "ssr",
    index: "08",
    title: "SSR / 同构",
    trigger: "SPA 首屏慢、SEO 差",
    era: "2016–",
    bottleneck: "纯客户端渲染(CSR)首屏要下载并执行大包 JS 才出内容，白屏久；且爬虫拿到空 HTML，SEO 差。",
    ideas: [
      { name: "纯客户端渲染", desc: "交互好但首屏慢、SEO 差。", verdict: "partial" },
      { name: "纯服务端渲染(老式)", desc: "首屏快、SEO 好，但交互弱、每次刷新。", verdict: "partial" },
      { name: "同构 SSR", desc: "服务端渲首屏 HTML，客户端 hydrate 接管。", verdict: "accepted" },
    ],
    solution: "SSR(Next.js/Nuxt)在服务端先渲出带内容的 HTML(首屏快、可被爬虫抓到)，到浏览器再 hydration 让 React/Vue 接管交互，兼得首屏与 SEO 和 SPA 体验。",
    essence: "服务端出首屏，客户端接管交互。",
    questions: [
      {
        q: "CSR、SSR、SSG 的区别与取舍？",
        a: "CSR 客户端渲染(交互强、首屏慢、SEO 弱)；SSR 每次请求服务端渲染(实时数据、SEO 好、服务器压力大)；SSG 构建时预生成静态页(最快、适合内容不常变)。按数据实时性和 SEO 取舍。",
        points: ["CSR/SSR/SSG", "首屏 vs 实时性", "hydration"],
      },
    ],
    tags: ["首屏", "SEO", "hydration"],
  },
  {
    id: "server-components",
    index: "09",
    title: "Server Components",
    trigger: "hydration 成本高",
    era: "2023–",
    bottleneck: "SSR 虽好，但整棵组件树都要在客户端 hydrate，JS 包越来越大；很多组件其实只展示数据、根本不需要交互，白白付出 JS 成本。",
    ideas: [
      { name: "全量 hydration", desc: "统一但下发大量本不必要的 JS。", verdict: "partial" },
      { name: "岛屿架构(Islands)", desc: "只对交互『岛屿』注水，其余纯静态。", verdict: "partial" },
      { name: "React Server Components", desc: "组件在服务端运行，只把结果传给客户端。", verdict: "accepted" },
    ],
    solution: "RSC 让组件默认在服务端运行、直接访问数据源，只把渲染结果(而非组件 JS)流式传给客户端；仅交互组件标记为 Client Component 下发 JS。大幅减小包体、贴近数据、更快。",
    essence: "让不需交互的组件留在服务端，只下发必要的 JS。",
    questions: [
      {
        q: "Server Components 解决了什么？和 SSR 什么关系？",
        a: "SSR 是把 SPA 首屏在服务端渲染再全量 hydrate；RSC 是组件级划分，服务端组件不进客户端包、可直连数据库，减少 JS 与瀑布请求。二者可组合(Next App Router)。",
        points: ["组件级服务端化", "零客户端 JS", "直连数据"],
      },
    ],
    tags: ["服务端组件", "包体优化", "流式"],
  },
];

// ────────────────────────────────────────────────────────────────
// 细分：AI 工程演化史
// ────────────────────────────────────────────────────────────────

const aiStages: EvolutionStage[] = [
  {
    id: "transformer",
    index: "01",
    title: "Transformer",
    trigger: "RNN 无法并行、记不住长文",
    era: "2017–",
    bottleneck: "RNN/LSTM 按序处理，无法并行训练、长距离依赖会遗忘，序列一长梯度消失，训练慢、效果有限。",
    ideas: [
      { name: "RNN/LSTM", desc: "有记忆但串行、难并行、长依赖弱。", verdict: "rejected" },
      { name: "CNN 处理序列", desc: "可并行但感受野有限，长依赖仍难。", verdict: "partial" },
      { name: "自注意力(Transformer)", desc: "每个 token 直接关注全序列，可并行。", verdict: "accepted" },
    ],
    solution: "Transformer 用自注意力让每个 token 一步看到全序列的关联(解决长依赖)，且计算可高度并行(适合 GPU 大规模训练)。『Attention is All You Need』奠定了现代大模型的架构基石。",
    essence: "用自注意力换来并行训练与全局依赖建模。",
    questions: [
      {
        q: "自注意力(Self-Attention)的原理？",
        a: "每个 token 生成 Query/Key/Value，用 Q·K 算出对其他所有 token 的注意力权重，加权求和 V 得到融合了全局上下文的新表示。多头则从多个子空间并行捕捉不同关系。",
        points: ["QKV", "全局加权", "多头并行"],
      },
      {
        q: "为什么 Transformer 需要位置编码？",
        a: "自注意力本身对顺序无感(是集合操作)，位置编码(正弦/可学习/RoPE)把 token 的位置信息注入，让模型区分语序。",
      },
    ],
    tags: ["自注意力", "并行", "架构基石"],
  },
  {
    id: "llm",
    index: "02",
    title: "LLM 大语言模型",
    trigger: "要通用语言能力",
    era: "2020–",
    bottleneck: "针对每个任务单独训练模型成本高、泛化差。能否有一个模型通吃翻译、问答、写作、编码等各种语言任务？",
    ideas: [
      { name: "每任务单独训练", desc: "精但不通用、成本高、数据要求大。", verdict: "rejected" },
      { name: "预训练+微调", desc: "先自监督预训练通用能力，再微调到任务。", verdict: "accepted" },
      { name: "大规模+涌现", desc: "参数与数据够大后涌现出通用少样本能力。", verdict: "accepted" },
    ],
    solution: "LLM 在海量文本上做自监督预训练(预测下一个 token)，规模足够大后涌现出通用的语言理解、推理和少样本能力，只需 Prompt 即可完成多种任务，无需为每个任务重训。",
    essence: "用超大规模预训练，换来通用的少样本能力。",
    questions: [
      {
        q: "预训练、微调、RLHF 各解决什么？",
        a: "预训练学通用语言与知识；SFT(指令微调)教它听懂并遵循指令；RLHF/对齐让输出符合人类偏好与安全。三段式把『会说话』变成『有用且对齐』。",
        points: ["预训练=能力", "SFT=听指令", "RLHF=对齐"],
      },
      {
        q: "什么是幻觉？为什么会产生？",
        a: "模型是按概率生成最像的文本，并不核对事实，缺乏知识时会『一本正经编造』。缓解靠 RAG 提供依据、工具核验、以及提示约束。",
      },
    ],
    tags: ["预训练", "涌现", "对齐"],
  },
  {
    id: "rag",
    index: "03",
    title: "RAG 检索增强",
    trigger: "知识过时、幻觉、缺私域",
    era: "2021–",
    bottleneck: "LLM 知识截止于训练时、记不住私有资料、会幻觉。重训成本极高，无法实时更新企业知识。",
    ideas: [
      { name: "把知识塞进 Prompt", desc: "简单但上下文有限、无法容纳海量文档。", verdict: "partial" },
      { name: "微调进模型", desc: "可注入知识但贵、更新慢、易遗忘。", verdict: "partial" },
      { name: "检索增强(RAG)", desc: "先检索相关片段再拼进上下文生成。", verdict: "accepted" },
    ],
    solution: "RAG 把知识存进向量库，用户提问时先做语义检索取回最相关片段，拼进上下文让 LLM 基于事实作答。知识可实时更新、可溯源、成本低，是私域问答的主流方案。",
    essence: "先检索再生成，让回答有据可依、可更新。",
    questions: [
      {
        q: "RAG 的完整流程？效果差如何排查？",
        a: "文档切分→向量化入库→查询向量检索 Top-K→(可选重排)→拼接上下文→LLM 生成。排查从『检索是否召回正确片段』入手：切分粒度、Embedding 质量、Top-K、重排、Prompt。",
        points: ["切分/嵌入/检索/生成", "先查召回", "重排提质"],
      },
      {
        q: "向量检索为什么能理解语义？",
        a: "Embedding 把文本映射到高维向量，语义相近的文本向量距离近。用近似最近邻(HNSW 等)在向量空间找相近片段，实现『按意思找』而非关键词匹配。",
      },
    ],
    tags: ["向量检索", "可溯源", "私域"],
  },
  {
    id: "function-calling",
    index: "04",
    title: "Function Calling",
    trigger: "模型只会说不会做",
    era: "2023–",
    bottleneck: "LLM 只能生成文本，无法查实时数据、执行操作、调用系统。要让它真正『干活』，得能触达外部世界。",
    ideas: [
      { name: "纯文本输出让人执行", desc: "模型给建议，人手动操作，割裂。", verdict: "rejected" },
      { name: "让模型输出结构化调用", desc: "模型按 schema 输出要调的函数和参数。", verdict: "accepted" },
    ],
    solution: "Function Calling 让模型根据你声明的工具 schema，输出结构化的函数名和参数；由程序真正执行(查天气、下单、查库)，再把结果回喂模型继续推理。模型获得了操作外部世界的手。",
    essence: "让模型输出结构化调用，接上工具去真正做事。",
    questions: [
      {
        q: "Function Calling 的工作机制？",
        a: "把工具的名称/参数 schema 告诉模型→模型判断需要时输出结构化调用(JSON)→你的代码执行并把结果回传→模型据此生成最终回答或继续下一步。模型只决策『调什么、传什么』，执行由外部完成。",
        points: ["声明 schema", "模型出结构化参数", "外部执行回喂"],
      },
    ],
    tags: ["工具调用", "结构化输出", "外部能力"],
  },
  {
    id: "agent",
    index: "05",
    title: "Agent",
    trigger: "复杂任务要多步自主",
    era: "2023–",
    bottleneck: "真实任务需要拆解、多步执行、根据中间结果调整，单次调用+一次工具调用还不够，需要自主循环。",
    ideas: [
      { name: "固定流程编排", desc: "可控但不灵活，覆盖不了开放任务。", verdict: "partial" },
      { name: "ReAct 循环", desc: "推理-行动-观察交替，模型自主决定下一步。", verdict: "accepted" },
    ],
    solution: "Agent 给 LLM 套上自治循环：规划任务→选择并调用工具(行动)→观察结果→反思调整→继续，直到完成。配合记忆(短期上下文+长期向量记忆)处理长任务。ReAct、Plan-and-Execute 是常见范式。",
    essence: "用『推理-行动-观察』闭环让模型自主完成多步任务。",
    questions: [
      {
        q: "ReAct 范式是什么？Agent 的核心组件？",
        a: "ReAct=Reasoning+Acting：模型交替『思考(Thought)→行动(Action 调工具)→观察(Observation)』直至得解。Agent 核心=LLM(大脑)+规划+工具+记忆，缺一则退化为普通调用。",
        points: ["Thought-Action-Observation", "规划+工具+记忆", "自治闭环"],
      },
      {
        q: "Agent 容易失控/绕圈怎么办？",
        a: "设最大步数与预算、加反思与自评、明确终止条件、工具结果结构化、必要时人类在环(HITL)审核关键动作。",
      },
    ],
    tags: ["ReAct", "自治循环", "记忆"],
  },
  {
    id: "mcp",
    index: "06",
    title: "MCP",
    trigger: "工具接入太碎片",
    era: "2024–",
    bottleneck: "每个 Agent 对接每种工具/数据源都要写一套私有适配，N 个模型×M 个工具=N×M 的重复对接，无法复用、难以生态化。",
    ideas: [
      { name: "各自私有集成", desc: "能用但重复造轮子、不通用、维护爆炸。", verdict: "rejected" },
      { name: "标准协议(MCP)", desc: "统一模型与工具/数据源的对接协议。", verdict: "accepted" },
    ],
    solution: "MCP(Model Context Protocol)为『模型↔工具/数据源』定义统一协议：工具方按标准暴露能力(MCP Server)，任意支持 MCP 的客户端即可即插即用。把 N×M 的私有对接变成 N+M 的标准接入，像 USB 一样通用。",
    essence: "给模型与工具的对接定标准，从 N×M 变 N+M。",
    questions: [
      {
        q: "MCP 解决什么问题？和 Function Calling 什么关系？",
        a: "Function Calling 是模型『决定调用哪个工具』的机制；MCP 是工具/数据源如何被标准化暴露和发现的『协议层』。前者是能力，后者是让能力可复用、可生态化的接口标准。",
        points: ["协议标准化", "即插即用", "N+M 复用"],
      },
    ],
    tags: ["协议", "标准化", "生态"],
  },
  {
    id: "multi-agent",
    index: "07",
    title: "多 Agent 协作",
    trigger: "单 Agent 能力有上限",
    era: "2024–",
    bottleneck: "单个 Agent 上下文有限、职责一多就顾此失彼，复杂项目(如写完整软件)需要分工、评审、并行。",
    ideas: [
      { name: "单个超级 Agent", desc: "简单但上下文和可靠性有天花板。", verdict: "partial" },
      { name: "多 Agent 分工协作", desc: "按角色拆分(规划者/执行者/评审者)协同。", verdict: "accepted" },
    ],
    solution: "多 Agent 把复杂任务按角色拆分(如产品/编码/测试/评审)，通过编排(主管-工人、辩论、流水线)协作，各 Agent 专注子任务并互相校验。用『分而治之+协作』突破单体能力上限。",
    essence: "用角色分工与协作编排，突破单 Agent 的能力上限。",
    questions: [
      {
        q: "多 Agent 系统的常见协作模式？挑战是什么？",
        a: "模式：主管编排(Supervisor)、流水线、辩论/投票、黑板共享。挑战：上下文与状态共享、通信成本与幻觉累积、终止与死锁、成本控制。需清晰的角色边界和编排层。",
        points: ["Supervisor/流水线/辩论", "状态共享难", "成本与收敛"],
      },
    ],
    tags: ["分工", "编排", "协作"],
  },
];

export const evolutionTracks: EvolutionTrack[] = [
  {
    id: "main",
    name: "主线",
    subtitle: "从一段程序，到会思考的系统",
    accent: "#4de0c9",
    stages: mainStages,
  },
  {
    id: "lowlevel",
    name: "计算机底层",
    subtitle: "CPU → 内存 → OS → 进程 → 线程 → JVM → V8 → GC",
    accent: "#8ec5ff",
    stages: lowLevelStages,
  },
  {
    id: "database",
    name: "数据库",
    subtitle: "文件 → B+树 → 索引 → 事务 → MVCC → 分库分表 → NewSQL",
    accent: "#ffb347",
    stages: databaseStages,
  },
  {
    id: "frontend",
    name: "前端",
    subtitle: "HTML → CSS → JS → jQuery → 模块化 → 打包 → 框架 → SSR → RSC",
    accent: "#ff6b6b",
    stages: frontendStages,
  },
  {
    id: "ai",
    name: "AI 工程",
    subtitle: "Transformer → LLM → RAG → Function Calling → Agent → MCP → 多Agent",
    accent: "#c792ea",
    stages: aiStages,
  },
];

export const verdictMeta: Record<IdeaVerdict, { label: string; color: string }> = {
  accepted: { label: "最终采纳", color: "#4de0c9" },
  partial: { label: "部分保留", color: "#ffb347" },
  rejected: { label: "被放弃", color: "#ff6b6b" },
};
