import { LightningElement, track } from 'lwc';

export default class AccountGrid extends LightningElement {
    @track accounts = [];
    @track isLoading = false;
    @track currentPage = 1;
    @track totalRecords = 0;
    @track totalPages = 0;
    
    // Configuración de paginación
    pageSize = 12; // 3 filas x 4 columnas

    // Datos mock para testing
    mockAccounts = [
        {
            Id: '001000000000001',
            Name: 'Bancolombia S.A.',
            Industry: 'Financial Services',
            Type: 'Customer',
            Phone: '+57 (4) 510-9000',
            Website: 'www.bancolombia.com',
            NumberOfEmployees: 45000,
            AnnualRevenue: 15000000000000
        },
        {
            Id: '001000000000002',
            Name: 'Grupo Éxito',
            Industry: 'Retail',
            Type: 'Customer',
            Phone: '+57 (4) 339-6565',
            Website: 'www.grupoexito.com.co',
            NumberOfEmployees: 85000,
            AnnualRevenue: 8500000000000
        },
        {
            Id: '001000000000003',
            Name: 'Ecopetrol S.A.',
            Industry: 'Energy',
            Type: 'Partner',
            Phone: '+57 (1) 234-4000',
            Website: 'www.ecopetrol.com.co',
            NumberOfEmployees: 18000,
            AnnualRevenue: 75000000000000
        },
        {
            Id: '001000000000004',
            Name: 'Avianca S.A.',
            Industry: 'Transportation',
            Type: 'Customer',
            Phone: '+57 (1) 401-3434',
            Website: 'www.avianca.com',
            NumberOfEmployees: 21000,
            AnnualRevenue: 12000000000000
        },
        {
            Id: '001000000000005',
            Name: 'Claro Colombia',
            Industry: 'Technology',
            Type: 'Partner',
            Phone: '+57 (1) 704-7000',
            Website: 'www.claro.com.co',
            NumberOfEmployees: 15000,
            AnnualRevenue: 18000000000000
        },
        {
            Id: '001000000000006',
            Name: 'Cemex Colombia',
            Industry: 'Manufacturing',
            Type: 'Customer',
            Phone: '+57 (1) 603-9000',
            Website: 'www.cemex.co',
            NumberOfEmployees: 3500,
            AnnualRevenue: 2800000000000
        },
        {
            Id: '001000000000007',
            Name: 'Universidad Nacional',
            Industry: 'Education',
            Type: 'Partner',
            Phone: '+57 (1) 316-5000',
            Website: 'www.unal.edu.co',
            NumberOfEmployees: 12000,
            AnnualRevenue: 850000000000
        },
        {
            Id: '001000000000008',
            Name: 'Constructora Bolívar',
            Industry: 'Construction',
            Type: 'Customer',
            Phone: '+57 (1) 423-4600',
            Website: 'www.constructorabolivar.com',
            NumberOfEmployees: 8500,
            AnnualRevenue: 3200000000000
        },
        {
            Id: '001000000000009',
            Name: 'Hospital San Ignacio',
            Industry: 'Healthcare',
            Type: 'Customer',
            Phone: '+57 (1) 594-6161',
            Website: 'www.husi.org.co',
            NumberOfEmployees: 2800,
            AnnualRevenue: 450000000000
        },
        {
            Id: '001000000000010',
            Name: 'EPM (Empresas Públicas de Medellín)',
            Industry: 'Utilities',
            Type: 'Partner',
            Phone: '+57 (4) 380-7676',
            Website: 'www.epm.com.co',
            NumberOfEmployees: 18500,
            AnnualRevenue: 9800000000000
        },
        {
            Id: '001000000000011',
            Name: 'Rappi Colombia',
            Industry: 'Technology',
            Type: 'Customer',
            Phone: '+57 (1) 508-8888',
            Website: 'www.rappi.com.co',
            NumberOfEmployees: 5000,
            AnnualRevenue: 1200000000000
        },
        {
            Id: '001000000000012',
            Name: 'Falabella Colombia',
            Industry: 'Retail',
            Type: 'Customer',
            Phone: '+57 (1) 587-7000',
            Website: 'www.falabella.com.co',
            NumberOfEmployees: 25000,
            AnnualRevenue: 4500000000000
        },
        {
            Id: '001000000000013',
            Name: 'Telecom Engineering',
            Industry: 'Technology',
            Type: 'Prospect',
            Phone: '+57 (1) 345-6789',
            Website: 'www.telecomeng.co',
            NumberOfEmployees: 150,
            AnnualRevenue: 85000000000
        },
        {
            Id: '001000000000014',
            Name: 'Alpina Productos Alimenticios',
            Industry: 'Manufacturing',
            Type: 'Customer',
            Phone: '+57 (1) 423-5555',
            Website: 'www.alpina.com.co',
            NumberOfEmployees: 6500,
            AnnualRevenue: 1800000000000
        },
        {
            Id: '001000000000015',
            Name: 'Inmobiliaria Bogotá',
            Industry: 'Real Estate',
            Type: 'Customer',
            Phone: '+57 (1) 612-3456',
            Website: 'www.inmobiliariabogota.co',
            NumberOfEmployees: 450,
            AnnualRevenue: 320000000000
        },
        {
            Id: '001000000000016',
            Name: 'TechStart Solutions',
            Industry: 'Technology',
            Type: 'Prospect',
            Phone: '+57 (1) 789-0123',
            Website: 'www.techstart.co',
            NumberOfEmployees: 85,
            AnnualRevenue: 45000000000
        },
        {
            Id: '001000000000017',
            Name: 'Logística Nacional S.A.',
            Industry: 'Transportation',
            Type: 'Partner',
            Phone: '+57 (1) 456-7890',
            Website: 'www.logisticanacional.co',
            NumberOfEmployees: 2200,
            AnnualRevenue: 650000000000
        },
        {
            Id: '001000000000018',
            Name: 'Consultoría Empresarial',
            Industry: 'Consulting',
            Type: 'Customer',
            Phone: '+57 (1) 234-5678',
            Website: 'www.consultoriaempresarial.co',
            NumberOfEmployees: 120,
            AnnualRevenue: 95000000000
        }
    ];

    connectedCallback() {
        this.loadMockData();
    }

    loadMockData() {
        this.isLoading = true;
        
        // Simular delay de red
        setTimeout(() => {
            this.totalRecords = this.mockAccounts.length;
            this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            this.updateCurrentPageData();
            this.isLoading = false;
        }, 500);
    }

    updateCurrentPageData() {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.accounts = this.mockAccounts.slice(startIndex, endIndex);
    }

    // Getters para la UI
    get hasAccounts() {
        return this.accounts && this.accounts.length > 0;
    }

    get showPagination() {
        return this.totalPages > 1;
    }

    get isPreviousDisabled() {
        return this.currentPage <= 1;
    }

    get isNextDisabled() {
        return this.currentPage >= this.totalPages;
    }

    get pageInfo() {
        const start = ((this.currentPage - 1) * this.pageSize) + 1;
        const end = Math.min(this.currentPage * this.pageSize, this.totalRecords);
        return `Página ${this.currentPage} de ${this.totalPages} - Mostrando ${start}-${end} de ${this.totalRecords} cuentas`;
    }

    // Manejar paginación
    handlePrevious() {
        if (this.currentPage > 1) {
            this.isLoading = true;
            this.currentPage--;
            
            setTimeout(() => {
                this.updateCurrentPageData();
                this.isLoading = false;
            }, 3000);
        }
    }

    handleNext() {
        if (this.currentPage < this.totalPages) {
            this.isLoading = true;
            this.currentPage++;
            
            setTimeout(() => {
                this.updateCurrentPageData();
                this.isLoading = false;
            }, 3000);
        }
    }
}