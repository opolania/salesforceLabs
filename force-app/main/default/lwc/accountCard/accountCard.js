import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class AccountCard extends NavigationMixin(LightningElement) {
    @api account;

    get displayName() {
        return this.account?.Name || 'Sin nombre';
    }

    get displayIndustry() {
        return this.account?.Industry || 'Sin industria';
    }

    get displayType() {
        return this.account?.Type || 'Sin tipo';
    }

    get displayPhone() {
        return this.account?.Phone || 'Sin teléfono';
    }

    get displayWebsite() {
        return this.account?.Website || 'Sin sitio web';
    }

    get displayEmployees() {
        return this.account?.NumberOfEmployees ? `${this.account.NumberOfEmployees} empleados` : 'Sin información';
    }

    get displayRevenue() {
        if (this.account?.AnnualRevenue) {
            return new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0
            }).format(this.account.AnnualRevenue);
        }
        return 'Sin información';
    }

    get industryIcon() {
        const industryIcons = {
            'Technology': 'utility:connected_apps',
            'Healthcare': 'utility:heart',
            'Financial Services': 'utility:money',
            'Manufacturing': 'utility:product',
            'Retail': 'utility:retail_execution',
            'Education': 'utility:education',
            'Construction': 'utility:builder',
            'Transportation': 'utility:truck',
            'Real Estate': 'utility:home'
        };
        return industryIcons[this.account?.Industry] || 'utility:company';
    }

    get initials() {
        if (!this.account?.Name) return 'N/A';
        const words = this.account.Name.split(' ');
        return words.length > 1 
            ? `${words[0][0]}${words[1][0]}`.toUpperCase()
            : words[0][0].toUpperCase();
    }

    handleAccountClick() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.account.Id,
                objectApiName: 'Account',
                actionName: 'view'
            }
        });
    }

    handleWebsiteClick(event) {
        event.stopPropagation();
        if (this.account?.Website) {
            let website = this.account.Website;
            if (!website.startsWith('http')) {
                website = 'https://' + website;
            }
            window.open(website, '_blank');
        }
    }
}