export interface DatePeriod {
  start: number;
  end: number;
}

export interface LifePeriod extends DatePeriod {
  name: string;
  color: string;
  description?: string;
  tags?: string[];
  style?: LifePeriodColorStyle;
}

type LifePeriodColorStyle = 'solid' | 'gradient';
