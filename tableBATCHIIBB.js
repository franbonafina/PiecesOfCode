<h:form id="batchIIBBDataTableForm">
				
						<p:panel id="batchIIBBDataTablePanel"
							widgetVar="batchIIBBDataTablePanel" visible="false" closable="true"
							toggleable="true" closeSpeed="0"
							rendered="#{batchIIBBController.searchActive}"
							styleClass="no-border no-spacing">

							<p:dataTable id="listBatchIIBB" widgetVar="listBatchIIBB"
								var="batchIIBB"
								value="#{batchIIBBController.batchIIBBService.findAll()}"
								selection="#{batchIIBBController.listBatchIIB}"
								paginatorAlwaysVisible="true" paginator="true"
								currentPageReportTemplate="#{msg['message.common.records']} {startRecord}-{endRecord} #{msg['message.common.of']} {totalRecords}. #{msg['message.common.page']} [{currentPage} #{msg['message.common.of']} {totalPages}]"
								paginatorTemplate="{CurrentPageReport} {FirstPageLink} {PreviousPageLink} 
					 			{PageLinks} {NextPageLink} {LastPageLink} {RowsPerPageDropdown}"
								rowsPerPageTemplate="5,10,15,20,25,50,100,200,500,1000" sortMode="single"
								rows="10" stickyHeader="false" lazy="true"
								emptyMessage="#{msg['message.datatable.emptyMessage']}"
								styleClass="dataTable-letters">
        
								<f:facet name="header">
									<table class="no-border dis-table-header">
										<tr>
											<td>												
												<p:commandButton id="viewButton" 
													styleClass="Fleft LightButton"
													icon="ui-icon-zoomin" process="@this"
													disabled="#{batchIIBBController.viewButtonDisabled}"
													action="#{batchIIBBController.viewSelected}"
													title="#{msg['message.common.view']}" />
												<p:commandButton id="viewConsumptionsButton" 
													styleClass="Fleft LightButton"
													icon="ui-icon-arrowreturnthick-1-s" process="@this"
													rendered="#{perm.isPermitted('consumption:view')}"
													disabled="#{invoiceController.viewConsumptionsDisabled}"
													action="#{invoiceController.viewConsumptions}"
													title="#{msg['message.invoice.tooltip.viewPrebillConsumptions']}" />
												<p:commandButton id="viewJournalButton" 
													styleClass="Fleft LightButton"
													icon="ui-icon-arrowthick-1-e" process="@this"
													rendered="#{perm.isPermitted('journal:view')}"
													disabled="#{invoiceController.viewButtonDisabled}"
													action="#{invoiceController.viewJournal}"
													title="#{msg['message.invoice.tooltip.viewJournalEntries']}" />
											</td>
											<td class="ui-datatable ui-datatable-header">
												<h:outputText 
													value="#{msg['message.invoice.title.table']}" />
											</td>
											<td>
												<p:commandButton 
													id="toggler" type="button"
													styleClass="LightButton Fright" 
													icon="ui-icon-wrench" />
												
	       										<p:columnToggler id="togglerInvoice"
	       											widgetVar="togglerInvoice" 
	       											datasource="listInvoice" 
	       											trigger="toggler" />
	       										<script type="text/javascript">removeDuplicatedToggler('#invoiceDataTableForm\\:listInvoice\\:togglerInvoice')</script>
											</td>	
										</tr>
									</table>
								</f:facet>

								<p:ajax event="page" oncomplete="updateToggles(PF('togglerInvoice'))" />
								
								<p:ajax event="rowDblselect" listener="#{invoiceController.rowListener}" 
									oncomplete="changeInvoiceAction()"/>
									
								<p:ajax event="rowSelect" update="invoiceDataTableForm:invoiceButtons viewButton viewJournalButton viewConsumptionsButton"/>
								<p:ajax event="rowUnselect" update="invoiceDataTableForm:invoiceButtons viewButton viewJournalButton viewConsumptionsButton"/>
								<p:ajax event="rowSelectCheckbox" update="invoiceDataTableForm:invoiceButtons viewButton viewJournalButton viewConsumptionsButton"/>
								<p:ajax event="rowUnselectCheckbox" update="invoiceDataTableForm:invoiceButtons viewButton viewJournalButton viewConsumptionsButton"/>
								<p:ajax event="toggleSelect" update="invoiceDataTableForm:invoiceButtons viewButton viewJournalButton viewConsumptionsButton" />

								<!--COLUMNS -->
								<p:column 
									selectionMode="multiple"
									toggleable="false"
									style="width:24px;text-align:center" />
								
								<!--ID-->
								<p:column headerText="#{msg['message.invoice.table.id']}"
									styleClass="col-customer-code">
									<h:outputText value="#{invoice.id}" />
								</p:column>
								
								<!--INVOICE NUMBER-->
								<p:column headerText="#{msg['message.invoice.table.number']}"
									styleClass="col-invoiceNumber">
									<h:outputText value="#{null != invoice.invoiceNumber ? invoice.invoiceNumber : ' - '}" />
								
								</p:column>
								
								<!--BILL TO CUSTOMER-->
								<p:column headerText="#{msg['message.invoice.table.billToCustomer']}"
									styleClass="col-customer-name">
									<h:outputText value="#{labelUtil.getCustomerLabel(invoice.customer)}" />
								</p:column>
								
								<!--ADVERTISER-->
								<p:column headerText="#{msg['message.invoice.table.advertiser']}"
									styleClass="col-customer-name">
									<h:outputText value="#{labelUtil.getCustomerLabel(invoice.advertiser)}" />
								</p:column>

								<!--INVOICE TYPE-->
								<p:column headerText="#{msg['message.invoice.table.type']}"
									styleClass="col-customer-invoiceType">
									<h:outputText value="#{labelUtil.getInvoiceTypeLabel(invoiceController.searchedCompany, invoice.invoiceType)}"/>
								</p:column>
								
								<!--INVOICE TYPE-->
								<p:column headerText="#{msg['message.invoice.table.subtype']}"
									styleClass="col-customer-invoiceType">
									<h:outputText value="#{empty invoice.invoiceSubtype ? '-' : invoice.invoiceSubtype}"/>
								</p:column>

								<!-- INVOICE DATE-->
								<p:column headerText="#{msg['message.invoice.table.date']}"
									styleClass="col-customer-invoiceDate">
									<h:outputText value="#{invoice.invoiceDate}">
										<f:convertDateTime dateStyle="short" timeStyle="short"
										locale="#{languageController.locale}"/>
									</h:outputText>
								</p:column>

								<!-- SERVICE TYPE -->
								<p:column
									headerText="#{msg['message.invoice.table.serviceType']}"
									styleClass="col-service-received">
									<h:outputText
										value="#{labelUtil.getServiceReceivedTypeLabel(invoice.serviceReceivedType)}" />
								</p:column>
								
								<!-- BILLING SCENARIO -->
								<p:column
									headerText="#{msg['message.invoice.billingScenario']}"
									styleClass="col-billing-scenario">
									<h:outputText
										value="#{invoice.billingScenario.number}" />
								</p:column>
								
								<!-- INVOICE SOURCE -->
								<p:column
									headerText="#{msg['message.invoice.table.invoiceSource']}"
									styleClass="col-transaction-currency">
									<h:outputText
										value="#{labelUtil.getInvoiceSourceLabel(invoice.invoiceSource)}" />
								</p:column>

								<!--CURRENCY transactionCurrency	-->
								<p:column headerText="#{msg['message.invoice.table.currency']}"
									styleClass="col-transaction-currency">
									<h:outputText value="#{invoice.transactionCurrency.iso3Code}" />
								</p:column>

								<!-- TRANSACTION NET AMOUNT -->
								<p:column
									headerText="#{msg['message.invoice.table.transactionNetAmount']}"
									styleClass="col-amount right">
									<h:outputText value="#{invoice.transactionNetAmount}" >
										<f:convertNumber 
											type="currency" currencySymbol="" locale="#{languageController.locale}" />
									</h:outputText>
								</p:column>

								<!-- TRANSACTION VAT AMOUNT -->
								<p:column
									headerText="#{msg['message.invoice.table.transactionVatAmount']}"
									styleClass="col-invoice-vat right">
									<h:outputText value="#{invoice.taxable and !invoice.billingScenario.is09() ? invoice.transactionVatAmount : '-'}" >
										<f:convertNumber 
											type="currency" currencySymbol="" locale="#{languageController.locale}" />									</h:outputText>
								</p:column>

								<!-- TRANSACTION GROSS AMOUNT -->
								<p:column
									headerText="#{msg['message.invoice.table.transactionGrossAmount']}"
									styleClass="col-amount right">
									<h:outputText value="#{!invoice.billingScenario.is09() ? invoice.transactionGrossAmount : invoice.transactionNetAmount}" >
										<f:convertNumber 
											type="currency" currencySymbol="" locale="#{languageController.locale}" />
									</h:outputText>
								</p:column>

								<!-- STATUS -->
								<p:column headerText="#{msg['message.invoice.table.status']}"
									styleClass="col-status">
									<h:outputText value="#{labelUtil.getInvoiceStatusLabel(invoice.status)}" />
								</p:column>

								<!-- SINGLE TRANSMISSION LINE -->
								<p:column headerText="#{msg['message.common.oneLine']}"
									styleClass="col-single-line">
									<p:selectBooleanCheckbox value="#{invoice.singleLineTransmission}"
										disabled="#{invoiceController.isOneLineCheckboxDisable(invoice)}"
										rendered="#{(not invoiceController.isOneLineCheckboxDisable(invoice))}">
										<p:ajax update="@this" process="@this" listener="#{invoiceController.saveCheckedInvoice(invoice)}" />
									</p:selectBooleanCheckbox>
									<h:outputText value="#{invoice.singleLineTransmission ? msg['message.common.true'] : msg['message.common.false'] }"
										rendered="#{(invoiceController.isOneLineCheckboxDisable(invoice))}" />
								</p:column>
							</p:dataTable>