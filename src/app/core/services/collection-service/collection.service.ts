import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { StoreCollection } from '../../models/product-models/store-collection.model';
import { environment } from 'src/environments/environment';
import { ToastService } from '../toast-service/toast.service';

@Injectable({
  providedIn: 'root',
})
export class CollectionService {
  private readonly baseUrl = `${environment.apiUrl}/collections`;

  private collectionsSource = new BehaviorSubject<StoreCollection[]>([]);
  collections$ = this.collectionsSource.asObservable();

  constructor(
    private http: HttpClient,
    private toastService: ToastService,
  ) {
    this.loadCollections();
  }

  // ============================================================
  // READ
  // ============================================================

  getCollections(): StoreCollection[] {
    return this.collectionsSource.value;
  }

  getBySlug(slug: string): StoreCollection | undefined {
    return this.collectionsSource.value.find((c) => c.slug === slug);
  }

  /**
   * GET /api/collections
   * Backend: { count, collections: StoreCollection[] }
   */
  loadCollections(): void {
    this.http.get<{ count: number; collections: StoreCollection[] }>(this.baseUrl).subscribe({
      next: (res) => {
        this.collectionsSource.next(res.collections ?? []);
      },
      error: (err) => {
        this.toastService.error(this.readError(err, 'Could not load collections.'));
        this.collectionsSource.next([]);
      },
    });
  }

  // ============================================================
  // CREATE
  // ============================================================

  /**
   * POST /api/collections  body: { name }
   * Backend builds the slug.
   */
  addCollection(name: string): void {
    const trimmed = name.trim();
    if (!trimmed) {
      this.toastService.error('Collection name is required.');
      return;
    }

    this.http
      .post<{ collection: StoreCollection }>(
        this.baseUrl,
        { name: trimmed },
        { headers: this.authHeaders() },
      )
      .subscribe({
        next: () => {
          this.toastService.success('Collection created.');
          this.loadCollections();
        },
        error: (err) => {
          this.toastService.error(this.readError(err, 'Could not create collection.'));
        },
      });
  }

  // ============================================================
  // UPDATE (name only — slug fixed on server)
  // ============================================================

  updateCollection(slug: string, name: string): void {
    const trimmed = name.trim();
    if (!trimmed) {
      this.toastService.error('Collection name is required.');
      return;
    }

    this.http
      .put<{ collection: StoreCollection }>(
        `${this.baseUrl}/${slug}`,
        { name: trimmed },
        { headers: this.authHeaders() },
      )
      .subscribe({
        next: () => {
          this.toastService.success('Collection updated.');
          this.loadCollections();
        },
        error: (err) => {
          this.toastService.error(this.readError(err, 'Could not update collection.'));
        },
      });
  }

  // ============================================================
  // DELETE
  // ============================================================

  deleteCollection(slug: string): void {
    this.http
      .delete<{ message: string }>(`${this.baseUrl}/${slug}`, {
        headers: this.authHeaders(),
      })
      .subscribe({
        next: () => {
          this.toastService.success('Collection deleted.');
          this.loadCollections();
        },
        error: (err) => {
          this.toastService.error(this.readError(err, 'Could not delete collection.'));
        },
      });
  }

  // ============================================================
  // PRIVATE
  // ============================================================

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // same key as CategoryService
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  private readError(err: unknown, fallback: string): string {
    const e = err as { error?: { message?: string }; message?: string };
    return e?.error?.message || e?.message || fallback;
  }
}