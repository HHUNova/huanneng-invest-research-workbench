import type { Track } from "../types";

export const dueDiligenceCategories = [
  {
    name: "工程",
    items: ["资源评估报告", "并网批复", "EPC 价格锁定", "场址地勘与气象折减", "关键设备质保"],
  },
  {
    name: "财务",
    items: ["PPA 电价条款", "资本金到位证明", "贷款意向书", "税收优惠批复", "敏感性测算底稿"],
  },
  {
    name: "法律",
    items: ["项目公司股权结构", "土地权属文件", "外资准入核验", "争端解决条款", "双边投资协定适用性"],
  },
  {
    name: "ESG",
    items: ["环评许可", "社区沟通记录", "本地就业计划", "供应链合规", "赤道原则差距分析"],
  },
];

export const trackSpecificChecks: Record<Track, string[]> = {
  solar: ["组件衰减保证", "逆变器替换计划", "眩光影响评估"],
  onshoreWind: ["风机可利用率保证", "道路吊装条件", "噪声与鸟类影响"],
  offshoreWind: ["海缆路由许可", "港口吊装能力", "海洋生态补偿"],
  storage: ["电芯循环寿命", "消防规范", "容量租赁与套利规则"],
  hydro: ["水文序列复核", "大坝安全与移民安置", "生态流量与流域许可"],
};
