export type DatePrecision = "year" | "month" | "day";

export type DatePresetKey =
  | "direct-input"
  | "last-7-days"
  | "last-month"
  | "two-months-ago"
  | "three-months-ago"
  | "this-year"
  | "last-year"
  | "two-years-ago";

export interface DatePresetOption {
  key: DatePresetKey;
  label: string;
}

interface BaseFilter {
  id: string;
  label: string;
}

export interface DateRangeFilterDefinition extends BaseFilter {
  type: "date-range";
  precision: DatePrecision;
  presets: DatePresetOption[];
}

export interface SelectFilterDefinition extends BaseFilter {
  type: "select";
  options: string[];
}

export interface CheckboxFilterDefinition extends BaseFilter {
  type: "checkbox";
  options: string[];
  required?: boolean;
  lockValues?: string[];
  enableSelectAll?: boolean;
}

export interface TextFilterDefinition extends BaseFilter {
  type: "text";
  placeholder?: string;
}

export type FilterDefinition =
  | DateRangeFilterDefinition
  | SelectFilterDefinition
  | CheckboxFilterDefinition
  | TextFilterDefinition;

export interface ReportPageDefinition {
  slug: string;
  title: string;
  filters: FilterDefinition[];
}

export interface LnbSectionDefinition {
  slug: string;
  title: string;
  pages: ReportPageDefinition[];
}

const SUBSIDIARIES = [
  "KB국민은행",
  "KB증권",
  "KB손해보험",
  "KB국민카드",
  "KB라이프생명",
  "KB캐피탈",
  "KB저축은행",
];

const SUBSIDIARIES_WITH_ALL = ["전체", ...SUBSIDIARIES];

const AFFILIATES_WITH_GROUP = ["KB스타클럽 서비스", "KB금융그룹", ...SUBSIDIARIES];

const PRESET_DAY_7_LAST_2: DatePresetOption[] = [
  { key: "last-7-days", label: "7일" },
  { key: "last-month", label: "전월" },
  { key: "two-months-ago", label: "전전월" },
];

const PRESET_DAY_DIRECT_7_LAST_2: DatePresetOption[] = [
  { key: "direct-input", label: "직접입력" },
  ...PRESET_DAY_7_LAST_2,
];

const PRESET_MONTH_LAST_3: DatePresetOption[] = [
  { key: "last-month", label: "전월" },
  { key: "two-months-ago", label: "전전월" },
  { key: "three-months-ago", label: "3개월전" },
];

const PRESET_YEAR_CURRENT_2: DatePresetOption[] = [
  { key: "this-year", label: "금년" },
  { key: "last-year", label: "작년" },
  { key: "two-years-ago", label: "재작년" },
];

const CUSTOMER_IDENTIFIER_FILTERS: TextFilterDefinition[] = [
  { type: "text", id: "customerName", label: "고객명" },
  { type: "text", id: "phoneNumber", label: "휴대폰번호" },
  { type: "text", id: "birthDate", label: "생년월일" },
  { type: "text", id: "membershipPin", label: "Membership PIN" },
];

export const LNB_SECTIONS: LnbSectionDefinition[] = [
  {
    slug: "dashboard-reports",
    title: "대시보드·리포트",
    pages: [
      {
        slug: "dashboard",
        title: "대시보드",
        filters: [
          {
            type: "date-range",
            id: "period",
            label: "조회기간",
            precision: "day",
            presets: PRESET_DAY_7_LAST_2,
          },
        ],
      },
      {
        slug: "personal-customer-status-report",
        title: "개인고객현황 리포트",
        filters: [
          {
            type: "date-range",
            id: "period",
            label: "조회기간",
            precision: "year",
            presets: PRESET_YEAR_CURRENT_2,
          },
          {
            type: "checkbox",
            id: "affiliates",
            label: "계열사",
            options: SUBSIDIARIES_WITH_ALL,
            required: true,
            lockValues: ["전체"],
            enableSelectAll: true,
          },
        ],
      },
      {
        slug: "grade-report",
        title: "등급 리포트",
        filters: [
          {
            type: "date-range",
            id: "period",
            label: "조회기간",
            precision: "year",
            presets: PRESET_YEAR_CURRENT_2,
          },
          {
            type: "select",
            id: "queryType",
            label: "조회구분",
            options: [
              "(계열사)실질등급",
              "그룹최고등급",
              "(계열사)실질등급(회원가입)",
              "그룹최고등급(회원가입)",
            ],
          },
          {
            type: "select",
            id: "affiliate",
            label: "계열사",
            options: SUBSIDIARIES,
          },
        ],
      },
      {
        slug: "performance-report",
        title: "실적 리포트",
        filters: [
          {
            type: "date-range",
            id: "period",
            label: "조회기간",
            precision: "month",
            presets: PRESET_MONTH_LAST_3,
          },
          {
            type: "select",
            id: "queryType",
            label: "조회구분",
            options: ["(계열사)실질등급"],
          },
          {
            type: "select",
            id: "affiliate",
            label: "계열사",
            options: SUBSIDIARIES,
          },
        ],
      },
      {
        slug: "age-report",
        title: "연령 리포트",
        filters: [
          {
            type: "date-range",
            id: "period",
            label: "조회기간",
            precision: "year",
            presets: PRESET_YEAR_CURRENT_2,
          },
          {
            type: "select",
            id: "affiliate",
            label: "계열사",
            options: AFFILIATES_WITH_GROUP,
          },
        ],
      },
      {
        slug: "service-report",
        title: "서비스 리포트",
        filters: [
          {
            type: "date-range",
            id: "period",
            label: "조회기간",
            precision: "day",
            presets: PRESET_DAY_7_LAST_2,
          },
        ],
      },
      {
        slug: "strategy-package-benefit-report",
        title: "전략패키지 혜택 리포트",
        filters: [
          {
            type: "date-range",
            id: "period",
            label: "조회기간",
            precision: "day",
            presets: PRESET_DAY_7_LAST_2,
          },
          {
            type: "checkbox",
            id: "packageNames",
            label: "제도명",
            options: [
              "전체",
              "MZ우대",
              "시니어우대",
              "잠재우수",
              "교차거래",
              "스타프렌즈모으기",
              "KB스타드림 룰렛",
            ],
            required: true,
            lockValues: ["전체"],
            enableSelectAll: true,
          },
        ],
      },
      {
        slug: "pointree-report",
        title: "포인트리 리포트",
        filters: [
          {
            type: "date-range",
            id: "period",
            label: "조회기간",
            precision: "year",
            presets: PRESET_YEAR_CURRENT_2,
          },
          {
            type: "select",
            id: "queryType",
            label: "조회구분",
            options: ["단순추산", "최종지급"],
          },
          {
            type: "checkbox",
            id: "affiliates",
            label: "계열사",
            options: SUBSIDIARIES_WITH_ALL,
            required: true,
            lockValues: ["전체"],
            enableSelectAll: true,
          },
        ],
      },
      {
        slug: "maestro-report",
        title: "마에스트로 리포트",
        filters: [
          {
            type: "date-range",
            id: "period",
            label: "조회기간",
            precision: "year",
            presets: PRESET_YEAR_CURRENT_2,
          },
          {
            type: "checkbox",
            id: "affiliates",
            label: "계열사",
            options: SUBSIDIARIES_WITH_ALL,
            required: true,
            lockValues: ["전체"],
            enableSelectAll: true,
          },
        ],
      },
      {
        slug: "signup-report",
        title: "회원가입 리포트",
        filters: [
          {
            type: "select",
            id: "queryType",
            label: "조회구분",
            options: ["총고객(누적)", "그룹실질등급(누적)", "그룹최고등급(누적)"],
          },
          {
            type: "date-range",
            id: "joinedAt",
            label: "회원가입일자",
            precision: "day",
            presets: PRESET_DAY_DIRECT_7_LAST_2,
          },
        ],
      },
      {
        slug: "signup-status",
        title: "회원가입현황",
        filters: [
          {
            type: "date-range",
            id: "period",
            label: "조회기간",
            precision: "year",
            presets: PRESET_YEAR_CURRENT_2,
          },
          {
            type: "select",
            id: "affiliate",
            label: "계열사",
            options: AFFILIATES_WITH_GROUP,
          },
        ],
      },
    ],
  },
  {
    slug: "kb-starclub-performance",
    title: "KB스타클럽 실적정보",
    pages: [
      {
        slug: "customer-performance-search",
        title: "고객정보 실적조회",
        filters: CUSTOMER_IDENTIFIER_FILTERS,
      },
      {
        slug: "score-calculator",
        title: "평점계산기",
        filters: CUSTOMER_IDENTIFIER_FILTERS,
      },
      {
        slug: "family-customer-search",
        title: "가족고객정보조회",
        filters: [
          ...CUSTOMER_IDENTIFIER_FILTERS,
          {
            type: "checkbox",
            id: "familyStatus",
            label: "가족현황",
            options: ["전체", "등록", ...SUBSIDIARIES],
            required: true,
            enableSelectAll: true,
          },
        ],
      },
      {
        slug: "special-selection-status",
        title: "특별선정현황조회",
        filters: [
          ...CUSTOMER_IDENTIFIER_FILTERS,
          {
            type: "checkbox",
            id: "registrationStatus",
            label: "등록현황",
            options: ["전체", "등록", "해지"],
            required: true,
          },
          {
            type: "checkbox",
            id: "selectionType",
            label: "선정구분",
            options: ["전체", "영업점선정", "본부선정", "전략패키지선정"],
            required: true,
          },
        ],
      },
    ],
  },
  {
    slug: "pointree-info",
    title: "포인트리 정보",
    pages: [
      {
        slug: "pointree-history",
        title: "포인트리 내역조회",
        filters: [
          {
            type: "date-range",
            id: "period",
            label: "조회기간",
            precision: "day",
            presets: PRESET_DAY_7_LAST_2,
          },
          ...CUSTOMER_IDENTIFIER_FILTERS,
          {
            type: "checkbox",
            id: "historyType",
            label: "내역구분",
            options: ["전체", "적립", "사용", "KB스타클럽포인트리"],
            required: true,
          },
        ],
      },
    ],
  },
  {
    slug: "work-helper",
    title: "업무도우미",
    pages: [
      {
        slug: "notice",
        title: "공지사항",
        filters: [
          { type: "text", id: "title", label: "제목" },
          { type: "text", id: "staffName", label: "직(임)원명" },
        ],
      },
      {
        slug: "faq",
        title: "자주묻는질문",
        filters: [
          {
            type: "checkbox",
            id: "category",
            label: "구분",
            options: ["전체", "제도", "회원가입/탈퇴", "포인트리", "혜택", "미션", "기타"],
            required: true,
          },
          { type: "text", id: "title", label: "제목" },
        ],
      },
      {
        slug: "work-manual",
        title: "업무메뉴얼",
        filters: [
          {
            type: "checkbox",
            id: "affiliate",
            label: "계열사",
            options: SUBSIDIARIES_WITH_ALL,
            required: true,
            enableSelectAll: true,
          },
          {
            type: "checkbox",
            id: "category",
            label: "구분",
            options: ["전체", "매뉴얼", "안내장", "서식"],
            required: true,
          },
          { type: "text", id: "title", label: "제목" },
        ],
      },
      {
        slug: "product-benefit-service",
        title: "상품·우대서비스",
        filters: [
          {
            type: "checkbox",
            id: "affiliate",
            label: "계열사",
            options: SUBSIDIARIES_WITH_ALL,
            required: true,
            enableSelectAll: true,
          },
          { type: "text", id: "title", label: "제목" },
        ],
      },
    ],
  },
  {
    slug: "communication",
    title: "커뮤니케이션",
    pages: [
      {
        slug: "group-department-share",
        title: "그룹/부서 공유방",
        filters: [
          {
            type: "checkbox",
            id: "affiliate",
            label: "계열사",
            options: SUBSIDIARIES_WITH_ALL,
            required: true,
            enableSelectAll: true,
          },
          { type: "text", id: "title", label: "제목" },
        ],
      },
      {
        slug: "policy-document-management",
        title: "제도서류관리",
        filters: [
          {
            type: "checkbox",
            id: "affiliate",
            label: "계열사",
            options: SUBSIDIARIES_WITH_ALL,
            required: true,
            enableSelectAll: true,
          },
          { type: "text", id: "title", label: "제목" },
          { type: "text", id: "staffName", label: "직(임)원명" },
        ],
      },
      {
        slug: "community",
        title: "커뮤니티",
        filters: [
          {
            type: "checkbox",
            id: "affiliate",
            label: "계열사",
            options: SUBSIDIARIES_WITH_ALL,
            required: true,
            enableSelectAll: true,
          },
          { type: "text", id: "title", label: "제목" },
          { type: "text", id: "staffName", label: "직(임)원명" },
        ],
      },
    ],
  },
  {
    slug: "staff-counseling-management",
    title: "직원상담정보관리",
    pages: [
      {
        slug: "authority-management",
        title: "권한관리",
        filters: [
          {
            type: "checkbox",
            id: "affiliate",
            label: "계열사",
            options: SUBSIDIARIES_WITH_ALL,
            required: true,
            enableSelectAll: true,
          },
          {
            type: "checkbox",
            id: "authority",
            label: "권한",
            options: [
              "전체",
              "권한(운영계열사)",
              "조회등록권한(KB스타클럽담당부서)",
              "조회권한(영업점,상담센터,일반본부)",
              "지주권한",
            ],
            required: true,
          },
          { type: "text", id: "departmentName", label: "부서명" },
          { type: "text", id: "staffName", label: "직(임)원명" },
          { type: "text", id: "staffNumber", label: "직(임)원번호" },
        ],
      },
      {
        slug: "log-search",
        title: "로그조회",
        filters: [
          {
            type: "date-range",
            id: "period",
            label: "조회기간",
            precision: "day",
            presets: PRESET_DAY_DIRECT_7_LAST_2,
          },
          {
            type: "checkbox",
            id: "affiliate",
            label: "계열사",
            options: SUBSIDIARIES_WITH_ALL,
            required: true,
            enableSelectAll: true,
          },
          {
            type: "checkbox",
            id: "queryTarget",
            label: "조회여부",
            options: ["전체", "고객정보", "실적정보"],
            required: true,
          },
          { type: "text", id: "staffName", label: "직(임)원명" },
          { type: "text", id: "staffNumber", label: "직(임)원번호" },
        ],
      },
    ],
  },
];

export function getDefaultRoutePath() {
  const firstSection = LNB_SECTIONS[0];
  const firstPage = firstSection.pages[0];
  return `/${firstSection.slug}/${firstPage.slug}`;
}

export function findPageDefinition(sectionSlug: string, pageSlug: string) {
  const section = LNB_SECTIONS.find((item) => item.slug === sectionSlug);
  if (!section) return null;

  const page = section.pages.find((item) => item.slug === pageSlug);
  if (!page) return null;

  return { section, page };
}
