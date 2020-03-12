INSERT INTO public.tplantilla (temp_id, temp_name, temp_jrxml, temp_tipo, temp_desc, temp_params) VALUES (2, 'FACTURA A5', '<?xml version="1.0" encoding="UTF-8"?>
<!-- Created with Jaspersoft Studio version 6.8.0.final using JasperReports Library version 6.8.0-2ed8dfabb690ff337a5797129f2cd92902b0c87b  -->
<jasperReport xmlns="http://jasperreports.sourceforge.net/jasperreports" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://jasperreports.sourceforge.net/jasperreports http://jasperreports.sourceforge.net/xsd/jasperreport.xsd" name="FacturaA4" pageWidth="595" pageHeight="450" columnWidth="555" leftMargin="20" rightMargin="20" topMargin="20" bottomMargin="20" uuid="7602f22c-deb8-46a4-b644-5e2e941694e7">
	<property name="com.jaspersoft.studio.data.defaultdataadapter" value="DataAdapter.xml"/>
	<property name="com.jaspersoft.studio.data.sql.tables" value=""/>
	<property name="com.jaspersoft.studio.unit." value="pixel"/>
	<property name="com.jaspersoft.studio.unit.pageHeight" value="pixel"/>
	<property name="com.jaspersoft.studio.unit.pageWidth" value="pixel"/>
	<property name="com.jaspersoft.studio.unit.topMargin" value="pixel"/>
	<property name="com.jaspersoft.studio.unit.bottomMargin" value="pixel"/>
	<property name="com.jaspersoft.studio.unit.leftMargin" value="pixel"/>
	<property name="com.jaspersoft.studio.unit.rightMargin" value="pixel"/>
	<property name="com.jaspersoft.studio.unit.columnWidth" value="pixel"/>
	<property name="com.jaspersoft.studio.unit.columnSpacing" value="pixel"/>
	<property name="com.jaspersoft.studio.data.sql.SQLQueryDesigner.sash.w1" value="258"/>
	<property name="com.jaspersoft.studio.data.sql.SQLQueryDesigner.sash.w2" value="731"/>
	<parameter name="desde" class="java.lang.Integer">
		<parameterDescription><![CDATA[]]></parameterDescription>
		<defaultValueExpression><![CDATA[1]]></defaultValueExpression>
	</parameter>
	<parameter name="hasta" class="java.lang.Integer">
		<parameterDescription><![CDATA[]]></parameterDescription>
		<defaultValueExpression><![CDATA[10]]></defaultValueExpression>
	</parameter>
	<queryString>
		<![CDATA[select s.a AS serie FROM generate_series($P{desde},$P{hasta}) AS s(a);]]>
	</queryString>
	<field name="serie" class="java.lang.Integer"/>
	<background>
		<band splitType="Stretch"/>
	</background>
	<title>
		<band splitType="Stretch">
			<property name="com.jaspersoft.studio.unit.height" value="pixel"/>
		</band>
	</title>
	<pageHeader>
		<band splitType="Stretch">
			<property name="com.jaspersoft.studio.unit.height" value="pixel"/>
		</band>
	</pageHeader>
	<columnHeader>
		<band splitType="Stretch">
			<property name="com.jaspersoft.studio.unit.height" value="pixel"/>
		</band>
	</columnHeader>
	<detail>
		<band height="410" splitType="Immediate">
			<property name="com.jaspersoft.studio.unit.height" value="pixel"/>
			<rectangle radius="20">
				<reportElement x="2" y="50" width="550" height="220" uuid="d0d6784b-02b9-4a8b-b4be-879ccf705991"/>
			</rectangle>
			<staticText>
				<reportElement x="10" y="11" width="240" height="30" uuid="4824ffcf-5539-47dd-82ea-c50cda1c2093"/>
				<textElement>
					<font size="20"/>
				</textElement>
				<text><![CDATA[FACTURA NRO:]]></text>
			</staticText>
			<textField>
				<reportElement x="320" y="10" width="225" height="30" uuid="99edab47-a552-41e3-9a0b-f98e91b2fbe8"/>
				<textElement>
					<font size="20"/>
				</textElement>
				<textFieldExpression><![CDATA[$F{serie}]]></textFieldExpression>
			</textField>
			<rectangle>
				<reportElement x="0" y="280" width="550" height="115" uuid="4ad16e7d-c06d-4220-9814-16ddf8b892cc"/>
			</rectangle>
			<staticText>
				<reportElement x="8" y="280" width="100" height="30" uuid="4e78b59c-fec5-4cb9-9dd7-8f953f1d721d"/>
				<text><![CDATA[Resumen:]]></text>
			</staticText>
		</band>
	</detail>
	<columnFooter>
		<band splitType="Stretch">
			<property name="com.jaspersoft.studio.unit.height" value="pixel"/>
		</band>
	</columnFooter>
	<pageFooter>
		<band splitType="Stretch">
			<property name="com.jaspersoft.studio.unit.height" value="pixel"/>
		</band>
	</pageFooter>
	<summary>
		<band splitType="Stretch">
			<property name="com.jaspersoft.studio.unit.height" value="pixel"/>
		</band>
	</summary>
</jasperReport>
', 1, null, null);
INSERT INTO public.tplantilla (temp_id, temp_name, temp_jrxml, temp_tipo, temp_desc, temp_params) VALUES (3, 'PRUEBAEDITADO', '<?xml version="1.0" encoding="UTF-8"?>
<!-- Created with Jaspersoft Studio version 6.8.0.final using JasperReports Library version 6.8.0-2ed8dfabb690ff337a5797129f2cd92902b0c87b  -->
<jasperReport xmlns="http://jasperreports.sourceforge.net/jasperreports" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://jasperreports.sourceforge.net/jasperreports http://jasperreports.sourceforge.net/xsd/jasperreport.xsd" name="FacturaA4" pageWidth="595" pageHeight="450" columnWidth="555" leftMargin="20" rightMargin="20" topMargin="20" bottomMargin="20" uuid="7602f22c-deb8-46a4-b644-5e2e941694e7">
	<property name="com.jaspersoft.studio.data.defaultdataadapter" value="DataAdapter.xml"/>
	<property name="com.jaspersoft.studio.data.sql.tables" value=""/>
	<property name="com.jaspersoft.studio.unit." value="pixel"/>
	<property name="com.jaspersoft.studio.unit.pageHeight" value="pixel"/>
	<property name="com.jaspersoft.studio.unit.pageWidth" value="pixel"/>
	<property name="com.jaspersoft.studio.unit.topMargin" value="pixel"/>
	<property name="com.jaspersoft.studio.unit.bottomMargin" value="pixel"/>
	<property name="com.jaspersoft.studio.unit.leftMargin" value="pixel"/>
	<property name="com.jaspersoft.studio.unit.rightMargin" value="pixel"/>
	<property name="com.jaspersoft.studio.unit.columnWidth" value="pixel"/>
	<property name="com.jaspersoft.studio.unit.columnSpacing" value="pixel"/>
	<property name="com.jaspersoft.studio.data.sql.SQLQueryDesigner.sash.w1" value="258"/>
	<property name="com.jaspersoft.studio.data.sql.SQLQueryDesigner.sash.w2" value="731"/>
	<parameter name="desde" class="java.lang.Integer">
		<parameterDescription><![CDATA[]]></parameterDescription>
		<defaultValueExpression><![CDATA[1]]></defaultValueExpression>
	</parameter>
	<parameter name="hasta" class="java.lang.Integer">
		<parameterDescription><![CDATA[]]></parameterDescription>
		<defaultValueExpression><![CDATA[10]]></defaultValueExpression>
	</parameter>
	<queryString>
		<![CDATA[select s.a AS serie FROM generate_series($P{desde},$P{hasta}) AS s(a);]]>
	</queryString>
	<field name="serie" class="java.lang.Integer"/>
	<background>
		<band splitType="Stretch"/>
	</background>
	<title>
		<band splitType="Stretch">
			<property name="com.jaspersoft.studio.unit.height" value="pixel"/>
		</band>
	</title>
	<pageHeader>
		<band splitType="Stretch">
			<property name="com.jaspersoft.studio.unit.height" value="pixel"/>
		</band>
	</pageHeader>
	<columnHeader>
		<band splitType="Stretch">
			<property name="com.jaspersoft.studio.unit.height" value="pixel"/>
		</band>
	</columnHeader>
	<detail>
		<band height="410" splitType="Immediate">
			<property name="com.jaspersoft.studio.unit.height" value="pixel"/>
			<rectangle radius="20">
				<reportElement x="2" y="50" width="550" height="220" uuid="d0d6784b-02b9-4a8b-b4be-879ccf705991"/>
			</rectangle>
			<staticText>
				<reportElement x="10" y="11" width="240" height="30" uuid="4824ffcf-5539-47dd-82ea-c50cda1c2093"/>
				<textElement>
					<font size="20"/>
				</textElement>
				<text><![CDATA[FACTURA NRO:]]></text>
			</staticText>
			<textField>
				<reportElement x="320" y="10" width="225" height="30" uuid="99edab47-a552-41e3-9a0b-f98e91b2fbe8"/>
				<textElement>
					<font size="20"/>
				</textElement>
				<textFieldExpression><![CDATA[$F{serie}]]></textFieldExpression>
			</textField>
			<rectangle>
				<reportElement x="0" y="280" width="550" height="115" uuid="4ad16e7d-c06d-4220-9814-16ddf8b892cc"/>
			</rectangle>
			<staticText>
				<reportElement x="8" y="280" width="100" height="30" uuid="4e78b59c-fec5-4cb9-9dd7-8f953f1d721d"/>
				<text><![CDATA[Resumen:]]></text>
			</staticText>
		</band>
	</detail>
	<columnFooter>
		<band splitType="Stretch">
			<property name="com.jaspersoft.studio.unit.height" value="pixel"/>
		</band>
	</columnFooter>
	<pageFooter>
		<band splitType="Stretch">
			<property name="com.jaspersoft.studio.unit.height" value="pixel"/>
		</band>
	</pageFooter>
	<summary>
		<band splitType="Stretch">
			<property name="com.jaspersoft.studio.unit.height" value="pixel"/>
		</band>
	</summary>
</jasperReport>
', 1, null, null);
INSERT INTO public.tplantilla (temp_id, temp_name, temp_jrxml, temp_tipo, temp_desc, temp_params) VALUES (4, 'FACTURAA4', '<?xml version="1.0" encoding="UTF-8"?>
<!-- Created with Jaspersoft Studio version 6.8.0.final using JasperReports Library version 6.8.0-2ed8dfabb690ff337a5797129f2cd92902b0c87b  -->
<jasperReport xmlns="http://jasperreports.sourceforge.net/jasperreports" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://jasperreports.sourceforge.net/jasperreports http://jasperreports.sourceforge.net/xsd/jasperreport.xsd" name="FacturaA4" pageWidth="595" pageHeight="450" columnWidth="555" leftMargin="20" rightMargin="20" topMargin="20" bottomMargin="20" uuid="7602f22c-deb8-46a4-b644-5e2e941694e7">
	<property name="com.jaspersoft.studio.data.defaultdataadapter" value="DataAdapter.xml"/>
	<property name="com.jaspersoft.studio.data.sql.tables" value=""/>
	<property name="com.jaspersoft.studio.unit." value="pixel"/>
	<property name="com.jaspersoft.studio.unit.pageHeight" value="pixel"/>
	<property name="com.jaspersoft.studio.unit.pageWidth" value="pixel"/>
	<property name="com.jaspersoft.studio.unit.topMargin" value="pixel"/>
	<property name="com.jaspersoft.studio.unit.bottomMargin" value="pixel"/>
	<property name="com.jaspersoft.studio.unit.leftMargin" value="pixel"/>
	<property name="com.jaspersoft.studio.unit.rightMargin" value="pixel"/>
	<property name="com.jaspersoft.studio.unit.columnWidth" value="pixel"/>
	<property name="com.jaspersoft.studio.unit.columnSpacing" value="pixel"/>
	<property name="com.jaspersoft.studio.data.sql.SQLQueryDesigner.sash.w1" value="258"/>
	<property name="com.jaspersoft.studio.data.sql.SQLQueryDesigner.sash.w2" value="731"/>
	<parameter name="desde" class="java.lang.Integer">
		<parameterDescription><![CDATA[]]></parameterDescription>
		<defaultValueExpression><![CDATA[1]]></defaultValueExpression>
	</parameter>
	<parameter name="hasta" class="java.lang.Integer">
		<parameterDescription><![CDATA[]]></parameterDescription>
		<defaultValueExpression><![CDATA[10]]></defaultValueExpression>
	</parameter>
	<queryString>
		<![CDATA[select s.a AS serie FROM generate_series($P{desde},$P{hasta}) AS s(a);]]>
	</queryString>
	<field name="serie" class="java.lang.Integer"/>
	<background>
		<band splitType="Stretch"/>
	</background>
	<title>
		<band splitType="Stretch">
			<property name="com.jaspersoft.studio.unit.height" value="pixel"/>
		</band>
	</title>
	<pageHeader>
		<band splitType="Stretch">
			<property name="com.jaspersoft.studio.unit.height" value="pixel"/>
		</band>
	</pageHeader>
	<columnHeader>
		<band splitType="Stretch">
			<property name="com.jaspersoft.studio.unit.height" value="pixel"/>
		</band>
	</columnHeader>
	<detail>
		<band height="410" splitType="Immediate">
			<property name="com.jaspersoft.studio.unit.height" value="pixel"/>
			<rectangle radius="20">
				<reportElement x="2" y="50" width="550" height="220" uuid="d0d6784b-02b9-4a8b-b4be-879ccf705991"/>
			</rectangle>
			<staticText>
				<reportElement x="10" y="11" width="240" height="30" uuid="4824ffcf-5539-47dd-82ea-c50cda1c2093"/>
				<textElement>
					<font size="20"/>
				</textElement>
				<text><![CDATA[FACTURA NRO:]]></text>
			</staticText>
			<textField>
				<reportElement x="320" y="10" width="225" height="30" uuid="99edab47-a552-41e3-9a0b-f98e91b2fbe8"/>
				<textElement>
					<font size="20"/>
				</textElement>
				<textFieldExpression><![CDATA[$F{serie}]]></textFieldExpression>
			</textField>
			<rectangle>
				<reportElement x="0" y="280" width="550" height="115" uuid="4ad16e7d-c06d-4220-9814-16ddf8b892cc"/>
			</rectangle>
			<staticText>
				<reportElement x="8" y="280" width="100" height="30" uuid="4e78b59c-fec5-4cb9-9dd7-8f953f1d721d"/>
				<text><![CDATA[Resumen:]]></text>
			</staticText>
		</band>
	</detail>
	<columnFooter>
		<band splitType="Stretch">
			<property name="com.jaspersoft.studio.unit.height" value="pixel"/>
		</band>
	</columnFooter>
	<pageFooter>
		<band splitType="Stretch">
			<property name="com.jaspersoft.studio.unit.height" value="pixel"/>
		</band>
	</pageFooter>
	<summary>
		<band splitType="Stretch">
			<property name="com.jaspersoft.studio.unit.height" value="pixel"/>
		</band>
	</summary>
</jasperReport>
', 1, null, null);
INSERT INTO public.tplantilla (temp_id, temp_name, temp_jrxml, temp_tipo, temp_desc, temp_params) VALUES (5, 'PRUEBA FACTURQ', '<?xml version="1.0" encoding="UTF-8"?>
<!-- Created with Jaspersoft Studio version 6.8.0.final using JasperReports Library version 6.8.0-2ed8dfabb690ff337a5797129f2cd92902b0c87b  -->
<jasperReport xmlns="http://jasperreports.sourceforge.net/jasperreports" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://jasperreports.sourceforge.net/jasperreports http://jasperreports.sourceforge.net/xsd/jasperreport.xsd" name="FacturaA4" pageWidth="595" pageHeight="450" columnWidth="555" leftMargin="20" rightMargin="20" topMargin="20" bottomMargin="20" uuid="7602f22c-deb8-46a4-b644-5e2e941694e7">
	<property name="com.jaspersoft.studio.data.defaultdataadapter" value="DataAdapter.xml"/>
	<property name="com.jaspersoft.studio.data.sql.tables" value=""/>
	<property name="com.jaspersoft.studio.unit." value="pixel"/>
	<property name="com.jaspersoft.studio.unit.pageHeight" value="pixel"/>
	<property name="com.jaspersoft.studio.unit.pageWidth" value="pixel"/>
	<property name="com.jaspersoft.studio.unit.topMargin" value="pixel"/>
	<property name="com.jaspersoft.studio.unit.bottomMargin" value="pixel"/>
	<property name="com.jaspersoft.studio.unit.leftMargin" value="pixel"/>
	<property name="com.jaspersoft.studio.unit.rightMargin" value="pixel"/>
	<property name="com.jaspersoft.studio.unit.columnWidth" value="pixel"/>
	<property name="com.jaspersoft.studio.unit.columnSpacing" value="pixel"/>
	<property name="com.jaspersoft.studio.data.sql.SQLQueryDesigner.sash.w1" value="258"/>
	<property name="com.jaspersoft.studio.data.sql.SQLQueryDesigner.sash.w2" value="731"/>
	<parameter name="desde" class="java.lang.Integer">
		<parameterDescription><![CDATA[]]></parameterDescription>
		<defaultValueExpression><![CDATA[1]]></defaultValueExpression>
	</parameter>
	<parameter name="hasta" class="java.lang.Integer">
		<parameterDescription><![CDATA[]]></parameterDescription>
		<defaultValueExpression><![CDATA[10]]></defaultValueExpression>
	</parameter>
	<queryString>
		<![CDATA[select s.a AS serie FROM generate_series($P{desde},$P{hasta}) AS s(a);]]>
	</queryString>
	<field name="serie" class="java.lang.Integer"/>
	<background>
		<band splitType="Stretch"/>
	</background>
	<title>
		<band splitType="Stretch">
			<property name="com.jaspersoft.studio.unit.height" value="pixel"/>
		</band>
	</title>
	<pageHeader>
		<band splitType="Stretch">
			<property name="com.jaspersoft.studio.unit.height" value="pixel"/>
		</band>
	</pageHeader>
	<columnHeader>
		<band splitType="Stretch">
			<property name="com.jaspersoft.studio.unit.height" value="pixel"/>
		</band>
	</columnHeader>
	<detail>
		<band height="410" splitType="Immediate">
			<property name="com.jaspersoft.studio.unit.height" value="pixel"/>
			<rectangle radius="20">
				<reportElement x="2" y="50" width="550" height="220" uuid="d0d6784b-02b9-4a8b-b4be-879ccf705991"/>
			</rectangle>
			<staticText>
				<reportElement x="10" y="11" width="240" height="30" uuid="4824ffcf-5539-47dd-82ea-c50cda1c2093"/>
				<textElement>
					<font size="20"/>
				</textElement>
				<text><![CDATA[FACTURA NRO:]]></text>
			</staticText>
			<textField>
				<reportElement x="320" y="10" width="225" height="30" uuid="99edab47-a552-41e3-9a0b-f98e91b2fbe8"/>
				<textElement>
					<font size="20"/>
				</textElement>
				<textFieldExpression><![CDATA[$F{serie}]]></textFieldExpression>
			</textField>
			<rectangle>
				<reportElement x="0" y="280" width="550" height="115" uuid="4ad16e7d-c06d-4220-9814-16ddf8b892cc"/>
			</rectangle>
			<staticText>
				<reportElement x="8" y="280" width="100" height="30" uuid="4e78b59c-fec5-4cb9-9dd7-8f953f1d721d"/>
				<text><![CDATA[Resumen:]]></text>
			</staticText>
		</band>
	</detail>
	<columnFooter>
		<band splitType="Stretch">
			<property name="com.jaspersoft.studio.unit.height" value="pixel"/>
		</band>
	</columnFooter>
	<pageFooter>
		<band splitType="Stretch">
			<property name="com.jaspersoft.studio.unit.height" value="pixel"/>
		</band>
	</pageFooter>
	<summary>
		<band splitType="Stretch">
			<property name="com.jaspersoft.studio.unit.height" value="pixel"/>
		</band>
	</summary>
</jasperReport>
', 1, null, null);
INSERT INTO public.tplantilla (temp_id, temp_name, temp_jrxml, temp_tipo, temp_desc, temp_params) VALUES (6, 'PLAN1', '<?xml version="1.0" encoding="UTF-8"?>
<!-- Created with Jaspersoft Studio version 6.8.0.final using JasperReports Library version 6.8.0-2ed8dfabb690ff337a5797129f2cd92902b0c87b  -->
<jasperReport xmlns="http://jasperreports.sourceforge.net/jasperreports" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://jasperreports.sourceforge.net/jasperreports http://jasperreports.sourceforge.net/xsd/jasperreport.xsd" name="FacturaA4" pageWidth="595" pageHeight="450" columnWidth="555" leftMargin="20" rightMargin="20" topMargin="20" bottomMargin="20" uuid="7602f22c-deb8-46a4-b644-5e2e941694e7">
	<property name="com.jaspersoft.studio.data.defaultdataadapter" value="DataAdapter.xml"/>
	<property name="com.jaspersoft.studio.data.sql.tables" value=""/>
	<property name="com.jaspersoft.studio.unit." value="pixel"/>
	<property name="com.jaspersoft.studio.unit.pageHeight" value="pixel"/>
	<property name="com.jaspersoft.studio.unit.pageWidth" value="pixel"/>
	<property name="com.jaspersoft.studio.unit.topMargin" value="pixel"/>
	<property name="com.jaspersoft.studio.unit.bottomMargin" value="pixel"/>
	<property name="com.jaspersoft.studio.unit.leftMargin" value="pixel"/>
	<property name="com.jaspersoft.studio.unit.rightMargin" value="pixel"/>
	<property name="com.jaspersoft.studio.unit.columnWidth" value="pixel"/>
	<property name="com.jaspersoft.studio.unit.columnSpacing" value="pixel"/>
	<property name="com.jaspersoft.studio.data.sql.SQLQueryDesigner.sash.w1" value="258"/>
	<property name="com.jaspersoft.studio.data.sql.SQLQueryDesigner.sash.w2" value="731"/>
	<parameter name="desde" class="java.lang.Integer">
		<parameterDescription><![CDATA[]]></parameterDescription>
		<defaultValueExpression><![CDATA[1]]></defaultValueExpression>
	</parameter>
	<parameter name="hasta" class="java.lang.Integer">
		<parameterDescription><![CDATA[]]></parameterDescription>
		<defaultValueExpression><![CDATA[10]]></defaultValueExpression>
	</parameter>
	<queryString>
		<![CDATA[select s.a AS serie FROM generate_series($P{desde},$P{hasta}) AS s(a);]]>
	</queryString>
	<field name="serie" class="java.lang.Integer"/>
	<background>
		<band splitType="Stretch"/>
	</background>
	<title>
		<band splitType="Stretch">
			<property name="com.jaspersoft.studio.unit.height" value="pixel"/>
		</band>
	</title>
	<pageHeader>
		<band splitType="Stretch">
			<property name="com.jaspersoft.studio.unit.height" value="pixel"/>
		</band>
	</pageHeader>
	<columnHeader>
		<band splitType="Stretch">
			<property name="com.jaspersoft.studio.unit.height" value="pixel"/>
		</band>
	</columnHeader>
	<detail>
		<band height="410" splitType="Immediate">
			<property name="com.jaspersoft.studio.unit.height" value="pixel"/>
			<rectangle radius="20">
				<reportElement x="2" y="50" width="550" height="220" uuid="d0d6784b-02b9-4a8b-b4be-879ccf705991"/>
			</rectangle>
			<staticText>
				<reportElement x="10" y="11" width="240" height="30" uuid="4824ffcf-5539-47dd-82ea-c50cda1c2093"/>
				<textElement>
					<font size="20"/>
				</textElement>
				<text><![CDATA[FACTURA NRO:]]></text>
			</staticText>
			<textField>
				<reportElement x="320" y="10" width="225" height="30" uuid="99edab47-a552-41e3-9a0b-f98e91b2fbe8"/>
				<textElement>
					<font size="20"/>
				</textElement>
				<textFieldExpression><![CDATA[$F{serie}]]></textFieldExpression>
			</textField>
			<rectangle>
				<reportElement x="0" y="280" width="550" height="115" uuid="4ad16e7d-c06d-4220-9814-16ddf8b892cc"/>
			</rectangle>
			<staticText>
				<reportElement x="8" y="280" width="100" height="30" uuid="4e78b59c-fec5-4cb9-9dd7-8f953f1d721d"/>
				<text><![CDATA[Resumen:]]></text>
			</staticText>
		</band>
	</detail>
	<columnFooter>
		<band splitType="Stretch">
			<property name="com.jaspersoft.studio.unit.height" value="pixel"/>
		</band>
	</columnFooter>
	<pageFooter>
		<band splitType="Stretch">
			<property name="com.jaspersoft.studio.unit.height" value="pixel"/>
		</band>
	</pageFooter>
	<summary>
		<band splitType="Stretch">
			<property name="com.jaspersoft.studio.unit.height" value="pixel"/>
		</band>
	</summary>
</jasperReport>
', 1, null, null);
INSERT INTO public.tplantilla (temp_id, temp_name, temp_jrxml, temp_tipo, temp_desc, temp_params) VALUES (7, 'PRUEBA9', '<?xml version="1.0" encoding="UTF-8"?>
<!-- Created with Jaspersoft Studio version 6.8.0.final using JasperReports Library version 6.8.0-2ed8dfabb690ff337a5797129f2cd92902b0c87b  -->
<jasperReport xmlns="http://jasperreports.sourceforge.net/jasperreports" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://jasperreports.sourceforge.net/jasperreports http://jasperreports.sourceforge.net/xsd/jasperreport.xsd" name="FacturaA4" pageWidth="595" pageHeight="450" columnWidth="555" leftMargin="20" rightMargin="20" topMargin="20" bottomMargin="20" uuid="7602f22c-deb8-46a4-b644-5e2e941694e7">
	<property name="com.jaspersoft.studio.data.defaultdataadapter" value="DataAdapter.xml"/>
	<property name="com.jaspersoft.studio.data.sql.tables" value=""/>
	<property name="com.jaspersoft.studio.unit." value="pixel"/>
	<property name="com.jaspersoft.studio.unit.pageHeight" value="pixel"/>
	<property name="com.jaspersoft.studio.unit.pageWidth" value="pixel"/>
	<property name="com.jaspersoft.studio.unit.topMargin" value="pixel"/>
	<property name="com.jaspersoft.studio.unit.bottomMargin" value="pixel"/>
	<property name="com.jaspersoft.studio.unit.leftMargin" value="pixel"/>
	<property name="com.jaspersoft.studio.unit.rightMargin" value="pixel"/>
	<property name="com.jaspersoft.studio.unit.columnWidth" value="pixel"/>
	<property name="com.jaspersoft.studio.unit.columnSpacing" value="pixel"/>
	<property name="com.jaspersoft.studio.data.sql.SQLQueryDesigner.sash.w1" value="258"/>
	<property name="com.jaspersoft.studio.data.sql.SQLQueryDesigner.sash.w2" value="731"/>
	<parameter name="desde" class="java.lang.Integer">
		<parameterDescription><![CDATA[]]></parameterDescription>
		<defaultValueExpression><![CDATA[1]]></defaultValueExpression>
	</parameter>
	<parameter name="hasta" class="java.lang.Integer">
		<parameterDescription><![CDATA[]]></parameterDescription>
		<defaultValueExpression><![CDATA[10]]></defaultValueExpression>
	</parameter>
	<queryString>
		<![CDATA[select s.a AS serie FROM generate_series($P{desde},$P{hasta}) AS s(a);]]>
	</queryString>
	<field name="serie" class="java.lang.Integer"/>
	<background>
		<band splitType="Stretch"/>
	</background>
	<title>
		<band splitType="Stretch">
			<property name="com.jaspersoft.studio.unit.height" value="pixel"/>
		</band>
	</title>
	<pageHeader>
		<band splitType="Stretch">
			<property name="com.jaspersoft.studio.unit.height" value="pixel"/>
		</band>
	</pageHeader>
	<columnHeader>
		<band splitType="Stretch">
			<property name="com.jaspersoft.studio.unit.height" value="pixel"/>
		</band>
	</columnHeader>
	<detail>
		<band height="410" splitType="Immediate">
			<property name="com.jaspersoft.studio.unit.height" value="pixel"/>
			<rectangle radius="20">
				<reportElement x="2" y="50" width="550" height="220" uuid="d0d6784b-02b9-4a8b-b4be-879ccf705991"/>
			</rectangle>
			<staticText>
				<reportElement x="10" y="11" width="240" height="30" uuid="4824ffcf-5539-47dd-82ea-c50cda1c2093"/>
				<textElement>
					<font size="20"/>
				</textElement>
				<text><![CDATA[TEMP2 FACTURA NRO:]]></text>
			</staticText>
			<textField>
				<reportElement x="320" y="10" width="225" height="30" uuid="99edab47-a552-41e3-9a0b-f98e91b2fbe8"/>
				<textElement>
					<font size="20"/>
				</textElement>
				<textFieldExpression><![CDATA[$F{serie}]]></textFieldExpression>
			</textField>
			<rectangle>
				<reportElement x="0" y="280" width="550" height="115" uuid="4ad16e7d-c06d-4220-9814-16ddf8b892cc"/>
			</rectangle>
			<staticText>
				<reportElement x="8" y="280" width="100" height="30" uuid="4e78b59c-fec5-4cb9-9dd7-8f953f1d721d"/>
				<text><![CDATA[Resumen:]]></text>
			</staticText>
		</band>
	</detail>
	<columnFooter>
		<band splitType="Stretch">
			<property name="com.jaspersoft.studio.unit.height" value="pixel"/>
		</band>
	</columnFooter>
	<pageFooter>
		<band splitType="Stretch">
			<property name="com.jaspersoft.studio.unit.height" value="pixel"/>
		</band>
	</pageFooter>
	<summary>
		<band splitType="Stretch">
			<property name="com.jaspersoft.studio.unit.height" value="pixel"/>
		</band>
	</summary>
</jasperReport>
', 1, null, null);
INSERT INTO public.tplantilla (temp_id, temp_name, temp_jrxml, temp_tipo, temp_desc, temp_params) VALUES (9, 'Log auditoría usuarios', '/Users/mjapon/PycharmProjects/fusay/fa/sysprintngjs/fusayal/scripts/reportes/logAuditoriaUsuarios.jrxml', 2, null, '{"fec":2}');
INSERT INTO public.tplantilla (temp_id, temp_name, temp_jrxml, temp_tipo, temp_desc, temp_params) VALUES (10, 'Log auditoría imprenta', '/Users/mjapon/PycharmProjects/fusay/fa/sysprintngjs/fusayal/scripts/reportes/logAuditoriaImprenta.jrxml', 2, null, '{}');
INSERT INTO public.tplantilla (temp_id, temp_name, temp_jrxml, temp_tipo, temp_desc, temp_params) VALUES (11, 'Log auditoría empresa', '/Users/mjapon/PycharmProjects/fusay/fa/sysprintngjs/fusayal/scripts/reportes/logAuditoriaContrib.jrxml', 2, null, '{"cnt":1}');
INSERT INTO public.tplantilla (temp_id, temp_name, temp_jrxml, temp_tipo, temp_desc, temp_params) VALUES (13, 'Log transaccional', '/Users/mjapon/PycharmProjects/fusay/fa/sysprintngjs/fusayal/scripts/reportes/logTransaccional.jrxml', 2, null, '{"fec":2, "cnt":1, "statusjob":1}');
INSERT INTO public.tplantilla (temp_id, temp_name, temp_jrxml, temp_tipo, temp_desc, temp_params) VALUES (8, 'Reporte autorizaciones', '/Users/mjapon/PycharmProjects/fusay/fa/sysprintngjs/fusayal/scripts/reportes/logAutorizaciones.jrxml', 3, null, '{}');
INSERT INTO public.tplantilla (temp_id, temp_name, temp_jrxml, temp_tipo, temp_desc, temp_params) VALUES (14, 'Log registro y control de acceso', '/Users/mjapon/PycharmProjects/fusay/fa/sysprintngjs/fusayal/scripts/reportes/logAccesoAudit.jrxml', 2, null, '{"fec":2}');
INSERT INTO public.tplantilla (temp_id, temp_name, temp_jrxml, temp_tipo, temp_desc, temp_params) VALUES (1, 'FACTURA VALE', '/Users/mjapon/PycharmProjects/fusay/fa/sysprintngjs/fusayal/scripts/reportes/facturaA4.jrxml', 1, null, null);
INSERT INTO public.tplantilla (temp_id, temp_name, temp_jrxml, temp_tipo, temp_desc, temp_params) VALUES (12, 'Log autorizaciones generadas', '/Users/mjapon/PycharmProjects/fusay/fa/sysprintngjs/fusayal/scripts/reportes/logAutorizacionesGen.jrxml', 2, null, '{"fec":2}');
INSERT INTO public.tplantilla (temp_id, temp_name, temp_jrxml, temp_tipo, temp_desc, temp_params) VALUES (15, 'COMPROBANTE RETENCION A5', '/Users/mjapon/PycharmProjects/fusay/fa/sysprintngjs/fusayal/scripts/reportes/ComprobanteRetencionA5.jrxml', 1, null, null);