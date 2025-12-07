import { Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Wish, WishStatus } from '../../services/wish.service';

@Component({
  selector: 'app-wishlist',
  imports: [CurrencyPipe],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.scss',
})
export class Wishlist {
  wishlist = input.required<Wish[]>();
  deletingWishId = input<string | null>(null);
  
  editWish = output<Wish>();
  markAsBought = output<Wish>();
  deleteWish = output<Wish>();

  normalizeUrl(url: string): string {
    if (!url) return '';
    const trimmed = url.trim();
    // Check if URL already has a protocol
    if (trimmed.match(/^[a-zA-Z]+:\/\//)) {
      return trimmed;
    }
    // Add https:// if missing
    return `https://${trimmed}`;
  }

  statusText(status: WishStatus) {
    switch (status) {
      case 'mangler':
        return 'Mangler';
      case 'købt':
        return 'Købt';
      case 'pakket-ind':
        return 'Pakket ind';
    }
  }

  statusIcon(status: WishStatus) {
    switch (status) {
      case 'mangler':
        return 'circle';
      case 'købt':
        return 'cart-shopping';
      case 'pakket-ind':
        return 'gift';
    }
  }
}
