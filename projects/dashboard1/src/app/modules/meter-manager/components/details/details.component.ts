import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailServiceService } from '../../services/detail-service.service';
import { DetailData, PredictionClass } from '../../models';
import { catchError } from 'rxjs/internal/operators/catchError';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private detailService = inject(DetailServiceService);

  meterName = signal<string>('');
  meterId = signal<number>(0);
  detailData = signal<DetailData[]>([]);

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.meterId.set(+params['id']);
      this.meterName.set(params['name'] || 'Van Dau 8');
    });

    this.detailService.getDetailsByMeterId(this.meterId()).pipe(
      catchError((err) => {
        console.error('Error fetching detail data', err);
        throw err;
      })
    ).subscribe((data: DetailData[]) => {
      this.detailData.set(data);
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusText(prediction: number): string {
    return prediction === PredictionClass.NORMAL ? 'Bình thường' : 'Bất thường';
  }

  getConfidenceClass(confidence: number): string {
    if (confidence >= 0.9) return 'confidence-high';
    if (confidence >= 0.8) return 'confidence-medium';
    return 'confidence-low';
  }
}
