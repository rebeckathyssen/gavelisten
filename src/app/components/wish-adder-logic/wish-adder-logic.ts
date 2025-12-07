import { Component, signal, output, input } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface ParsedWish {
  name: string;
  link?: string;
}

@Component({
  selector: 'app-wish-adder-logic',
  imports: [FormsModule],
  templateUrl: './wish-adder-logic.html',
  styleUrl: './wish-adder-logic.scss',
})
export class WishAdderLogic {
  show = input.required<boolean>();
  close = output<void>();
  confirm = output<ParsedWish[]>();

  wishText = signal('');
  isProcessing = signal(false);

  closeModal() {
    this.wishText.set('');
    this.close.emit();
  }

  detectLink(text: string): { cleanText: string; link?: string } {
    // Regex patterns to detect links
    const urlPattern = /(https?:\/\/[^\s]+|www\.[^\s]+|[^\s]+\.(dk|com|net|org|io|co|uk|de|se|no|eu)[^\s]*)/gi;
    
    const matches = text.match(urlPattern);
    
    if (matches && matches.length > 0) {
      // Take the first link found
      const link = matches[0];
      // Remove the link from the text
      const cleanText = text.replace(link, '').trim();
      return { cleanText, link };
    }
    
    return { cleanText: text.trim() };
  }

  parseWishes(): ParsedWish[] {
    const text = this.wishText().trim();
    if (!text) return [];

    // Split by line breaks
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);

    // Parse each line
    const wishes: ParsedWish[] = lines.map(line => {
      // Remove leading bullet points or dashes
      let cleanLine = line.replace(/^[-•*]\s*/, '');
      
      // Detect and extract link
      const { cleanText, link } = this.detectLink(cleanLine);
      
      return {
        name: cleanText || line, // Fallback to original if cleanText is empty
        link: link,
      };
    });

    return wishes;
  }

  async processWishes() {
    const wishes = this.parseWishes();
    
    if (wishes.length === 0) {
      alert('Ingen gyldige ønsker fundet. Sørg for at hver linje indeholder et ønske.');
      return;
    }

    this.isProcessing.set(true);
    
    try {
      this.confirm.emit(wishes);
      this.wishText.set('');
    } catch (error) {
      console.error('Error processing wishes:', error);
      alert('Der opstod en fejl. Prøv igen.');
    } finally {
      this.isProcessing.set(false);
    }
  }
}

