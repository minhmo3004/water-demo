import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { ChartData, ChartType } from '../../../core/models/chart-data.interface';

@Injectable({ providedIn: 'root' })
export class ChartMockApiService {
  private getLegendByType(type: ChartType): { label: string; color: string }[] {
    switch (type) {
      case 'anomaly':
        return [
          { label: 'Lưu lượng thực tế', color: '#4285f4' },
          { label: 'Ngưỡng dự đoán', color: '#34a853' }
        ];
      case 'anomaly-ai':
        return [
          { label: 'Lưu lượng thực tế', color: '#4285f4' },
          { label: 'Dự đoán AI', color: '#fbbc05' }
        ];
      default:
        return [
          { label: 'Lưu lượng thực tế', color: '#4285f4' },
          { label: 'Lưu lượng trung bình', color: '#34a853' }
        ];
    }
  }

  private getSubtitleByType(type: ChartType): string {
    switch (type) {
      case 'anomaly':
        return 'Phân tích bất thường dựa trên ngưỡng';
      case 'anomaly-ai':
        return 'Phân tích bất thường sử dụng AI';
      default:
        return 'Theo dõi lưu lượng thời gian thực';
    }
  }

  private generateSeriesPoints(count: number): { value: number; predictedValue: number; timestamp: string }[] {
    const now = new Date();
    return Array.from({ length: count }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (count - 1 - i));
      const base = 20 + Math.sin(i / 3) * 5 + (Math.random() - 0.5) * 2;
      const predicted = base + (Math.random() - 0.5) * 2;
      return {
        value: Number(base.toFixed(2)),
        predictedValue: Number(predicted.toFixed(2)),
        timestamp: d.toISOString().split('T')[0]
      };
    });
  }

  public getChartData(meterId: number, meterName: string, type: ChartType): Observable<ChartData> {
    const points = this.generateSeriesPoints(20);
    const config = {
      title: `Biểu đồ lưu lượng - ${meterName}`,
      subtitle: this.getSubtitleByType(type),
      yAxisLabel: 'Lưu lượng (m³/h)',
      xAxisLabel: 'Thời gian',
      legend: this.getLegendByType(type)
    };

    const data: ChartData = {
      meterId,
      meterName,
      config,
      data: points.map(p => ({ timestamp: p.timestamp, value: p.value, predictedValue: p.predictedValue }))
    };

    // giả lập API delay
    return of(data).pipe(delay(150));
  }
}


