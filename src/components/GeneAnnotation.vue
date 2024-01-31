<template>
  <div style="height: 1300px;">
    <div style="text-align: left;">
      <p style="color: #2190bd; font-size: 13px; font-weight: bold;">Gene Annotation</p>
      <div class="line"></div>
      <p class="gene_annotation_text">This module displays the currently collected fish genome annotation data, including
        gene id, gene name, chromosome where the gene is located, the start and end positions of the gene, and the
        positive and negative strand data where it is located. You can use the following interface to select the
        corresponding keywords to search for the annotation data of related genomes, such as gene id, gene name, etc., or
        you can directly instruct to search for a specific species to retrieve all related annotated genome data of the
        entire species come out.</p>

      <div class="select_option_outer">
        <div class="select_option_inner">
          <!-- 展示的值都是label的属性值，获取到的值都是value的属性值 -->
          <el-select v-model="speciesSearchOptionValue" placeholder="Specie Name" style="width: 250px;">
            <el-option v-for="item in speciesOptions" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
          <el-select v-model="geneSourceSearchOptionValue" clearable placeholder="Gene Source" class="radio-box-spacin">
            <el-option v-for="item in geneSourceOptions" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>

          <el-autocomplete v-model="state" filterable clearable :fetch-suggestions="querySearchAsync"
            placeholder="Select a Gene Id or Annotation keywords" @select="handleSelect"
            style="width: 520px;"></el-autocomplete>

          <el-button type="primary" plain icon="el-icon-search" style="float: right;" @click="geneAnnatitionSearch"
            :loading="loading">search</el-button>
        </div>
      </div>

      <div class="table_outer">
        <div class="table_inner">
          <div style="height: 30px;">
            <el-button class="tick_download" size="mini" icon="el-icon-download" @click="tickDownload"
              plain>TickDownload</el-button>
            <el-button class="download_all" size="mini" icon="el-icon-download" @click="downloadAll"
              plain>DownloadAll</el-button>
            <el-input v-model="tableFilter" size="mini" clearable placeholder="input keywords to filter" class="table_filter" />
          </div>

          <el-table ref="multipleTable" :border="isBorder"
            :data="pageFilterTableData.filter(data => !tableFilter || data.geneID.toLowerCase().includes(tableFilter.toLowerCase()))"
            tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <!-- prop属性的属性值表示自动会去寻找表格数据中带有其属性值的值，并赋值给当前单元格，当然如果你不指定prop属性值，也可以通过template标签的slot-scope插槽将数据渲染到对应的单元格当中，label表示的是列头的名。show-overflow-tooltip表示当单元格的数据过长无法全部显示的时候将会弹出对应的tip进行显示 -->
            <el-table-column label="Gene ID" width="220">
              <template slot-scope="scope">{{ scope.row.geneID }}</template>
            </el-table-column>
            <el-table-column label="DataBase" prop="dataBase" width="120">
            </el-table-column>
            <el-table-column label="BioType" prop="biotype" width="150">
            </el-table-column>
            <el-table-column label="Chromsome" prop="chromsome" width="120">
            </el-table-column>
            <el-table-column label="Annotation" prop="annotation" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="JBrowse" width="120">
              <template><span style="color: #5390bd;"
                  @click="showJbrowseView(speciesSearchOptionValue)">JBrowse</span></template>
            </el-table-column>
          </el-table>

          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
            :page-sizes="[5, 10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
            :total="tableData.length" style="margin-top: 30px;">
          </el-pagination>

          <div style="margin-top: 20px">
            <el-button plain
              @click="toggleSelection([pageFilterTableData[pageFilterTableData.length - 1], pageFilterTableData[2]])">Toggle
              the selected state
              of the last row</el-button>
            <el-button plain @click="toggleSelection()">Uncheck</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Select, Option, Autocomplete, Button, Table, TableColumn, Pagination, Message, Input } from "element-ui";

export default {
  name: 'GeneAnnotation',
  components: {
    "el-select": Select,
    "el-option": Option,
    "el-autocomplete": Autocomplete,
    "el-button": Button,
    "el-table": Table,
    "el-table-column": TableColumn,
    "el-pagination": Pagination,
    // "el-backtop": Backtop
    "el-input": Input
  },
  data() {
    return {
      speciesOptions: ['Cottoperca gobio', 'Camarhynchus parvulus', 'Danio rerio'],
      geneSourceOptions: ['ALL', 'GO', 'KEGG', 'ENSEMBAL', 'PANTHER'],
      speciesSearchOptionValue: 'Cottoperca gobio',
      geneSourceSearchOptionValue: '',
      // state: [],
      restaurants: [],
      state: '',
      timeout: null,
      tableData: [
        {
          geneID: 'ENSCGOG00000000322',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'Dans',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000203',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000034',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000402',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000142',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        }, {
          geneID: 'ENSCGOG00000000002',
          dataBase: 'ensembl',
          biotype: 'protein_coding',
          chromsome: 'chr1',
          annotation: 'exportin-1-like [Source:NCBI gene%3BAcc:115012690]'
        },
      ],
      pageFilterTableData: [],
      multipleSelection: [],
      loading: false,
      isBorder: true,
      currentPage: 1,
      pageSize: 10,
      tableFilter: ""
    }
  },
  mounted() {
    this.restaurants = this.loadAll();
  },
  created() {
    this.pageRenderingTableData();
    console.log("create data:", this.pageFilterTableData);
  },
  methods: {
    /* 加载输入框方法操作 */
    loadAll() {
      return [
        { "value": "三全鲜食（北新泾店）", "address": "长宁区新渔路144号" },
        { "value": "Hot honey 首尔炸鸡（仙霞路）", "address": "上海市长宁区淞虹路661号" },
        { "value": "新旺角茶餐厅", "address": "上海市普陀区真北路988号创邑金沙谷6号楼113" },
        { "value": "泷千家(天山西路店)", "address": "天山西路438号" },
        { "value": "胖仙女纸杯蛋糕（上海凌空店）", "address": "上海市长宁区金钟路968号1幢18号楼一层商铺18-101" },
        { "value": "贡茶", "address": "上海市长宁区金钟路633号" },
        { "value": "豪大大香鸡排超级奶爸", "address": "上海市嘉定区曹安公路曹安路1685号" },
        { "value": "茶芝兰（奶茶，手抓饼）", "address": "上海市普陀区同普路1435号" },
        { "value": "十二泷町", "address": "上海市北翟路1444弄81号B幢-107" },
        { "value": "星移浓缩咖啡", "address": "上海市嘉定区新郁路817号" },
        { "value": "阿姨奶茶/豪大大", "address": "嘉定区曹安路1611号" },
        { "value": "新麦甜四季甜品炸鸡", "address": "嘉定区曹安公路2383弄55号" },
        { "value": "Monica摩托主题咖啡店", "address": "嘉定区江桥镇曹安公路2409号1F，2383弄62号1F" },
        { "value": "浮生若茶（凌空soho店）", "address": "上海长宁区金钟路968号9号楼地下一层" },
        { "value": "NONO JUICE  鲜榨果汁", "address": "上海市长宁区天山西路119号" },
        { "value": "CoCo都可(北新泾店）", "address": "上海市长宁区仙霞西路" },
        { "value": "快乐柠檬（神州智慧店）", "address": "上海市长宁区天山西路567号1层R117号店铺" },
        { "value": "Merci Paul cafe", "address": "上海市普陀区光复西路丹巴路28弄6号楼819" },
        { "value": "猫山王（西郊百联店）", "address": "上海市长宁区仙霞西路88号第一层G05-F01-1-306" },
        { "value": "枪会山", "address": "上海市普陀区棕榈路" },
        { "value": "纵食", "address": "元丰天山花园(东门) 双流路267号" },
        { "value": "钱记", "address": "上海市长宁区天山西路" },
        { "value": "壹杯加", "address": "上海市长宁区通协路" },
        { "value": "唦哇嘀咖", "address": "上海市长宁区新泾镇金钟路999号2幢（B幢）第01层第1-02A单元" },
        { "value": "爱茜茜里(西郊百联)", "address": "长宁区仙霞西路88号1305室" },
        { "value": "爱茜茜里(近铁广场)", "address": "上海市普陀区真北路818号近铁城市广场北区地下二楼N-B2-O2-C商铺" },
        { "value": "鲜果榨汁（金沙江路和美广店）", "address": "普陀区金沙江路2239号金沙和美广场B1-10-6" },
        { "value": "开心丽果（缤谷店）", "address": "上海市长宁区威宁路天山路341号" },
        { "value": "超级鸡车（丰庄路店）", "address": "上海市嘉定区丰庄路240号" },
        { "value": "妙生活果园（北新泾店）", "address": "长宁区新渔路144号" },
        { "value": "香宜度麻辣香锅", "address": "长宁区淞虹路148号" },
        { "value": "凡仔汉堡（老真北路店）", "address": "上海市普陀区老真北路160号" },
        { "value": "港式小铺", "address": "上海市长宁区金钟路968号15楼15-105室" },
        { "value": "蜀香源麻辣香锅（剑河路店）", "address": "剑河路443-1" },
        { "value": "北京饺子馆", "address": "长宁区北新泾街道天山西路490-1号" },
        { "value": "饭典*新简餐（凌空SOHO店）", "address": "上海市长宁区金钟路968号9号楼地下一层9-83室" },
        { "value": "焦耳·川式快餐（金钟路店）", "address": "上海市金钟路633号地下一层甲部" },
        { "value": "动力鸡车", "address": "长宁区仙霞西路299弄3号101B" },
        { "value": "浏阳蒸菜", "address": "天山西路430号" },
        { "value": "四海游龙（天山西路店）", "address": "上海市长宁区天山西路" },
        { "value": "樱花食堂（凌空店）", "address": "上海市长宁区金钟路968号15楼15-105室" },
        { "value": "壹分米客家传统调制米粉(天山店)", "address": "天山西路428号" },
        { "value": "福荣祥烧腊（平溪路店）", "address": "上海市长宁区协和路福泉路255弄57-73号" },
        { "value": "速记黄焖鸡米饭", "address": "上海市长宁区北新泾街道金钟路180号1层01号摊位" },
        { "value": "红辣椒麻辣烫", "address": "上海市长宁区天山西路492号" },
        { "value": "(小杨生煎)西郊百联餐厅", "address": "长宁区仙霞西路88号百联2楼" },
        { "value": "阳阳麻辣烫", "address": "天山西路389号" },
        { "value": "南拳妈妈龙虾盖浇饭", "address": "普陀区金沙江路1699号鑫乐惠美食广场A13" }
      ];
    },
    querySearchAsync(queryString, cb) {
      let restaurants = this.restaurants;
      let results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 1500 * Math.random());
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      console.log(item);
    },
    geneAnnatitionSearch() {
      console.log(this.speciesSearchOptionValue + "====" + this.geneSourceSearchOptionValue + "====" + this.state);
      this.loading = true;
      // 当下次再来访问的时候删除上一个定时器
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.loading = false;
      }, 2000);
    },
    /* 表格方法操作 */
    tickDownload() {
      if (this.multipleSelection.length === 0) {
        Message({
          showClose: true,
          message: 'Please tick the data to be downloaded',
          type: 'warning'
        });
        return;
      }
      // 封装我们需要导出的数据信息
      let downloadDataList = [];
      // 这里处理的是Excel的表头，必须放在数据结构的第一个位置
      downloadDataList.unshift(["Index", "GeneID", "DataBase", "BioType", "Chromsome", "Annotation"])
      this.multipleSelection.forEach((item, index) => {
        downloadDataList.push([index + 1, item.geneID, item.dataBase, item.biotype, item.chromsome, item.annotation]);
      });
      // 下载的js逻辑已经封装到了vue当中了，这里可以直接调用vue当中的实例，第一个参数即传入的数组数据，数组当中包含多个对象信息，第二个是导出下载的文件名称，可根据实际传入即可。
      this.downloadXlsx(downloadDataList, this.speciesSearchOptionValue + ".xlsx");
    },
    downloadAll() {
      let downloadDataList = [];
      downloadDataList.unshift(["Index", "GeneID", "DataBase", "BioType", "Chromsome", "Annotation"])
      this.tableData.forEach((item, index) => {
        downloadDataList.push([index + 1, item.geneID, item.dataBase, item.biotype, item.chromsome, item.annotation]);
      });
      this.downloadXlsx(downloadDataList, this.speciesSearchOptionValue + ".xlsx");
    },
    showJbrowseView(speciesName) {
      if (speciesName != '' && speciesName != null) {
        console.log("anno nav:", speciesName);
        this.$router.push({
          name: "jbrowse",
          query: {
            speciesName: speciesName,
          },
        });
      }
    },
    pageRenderingTableData() {
      if (this.currentPage == Math.ceil(this.tableData.length / this.pageSize)) {
        console.log("the last page");
        this.pageFilterTableData = this.tableData.slice((this.currentPage - 1) * this.pageSize, this.tableData.length)
      }
      this.pageFilterTableData = this.tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    },
    // 分页功能
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.pageRenderingTableData();
      console.log("pageSizeChange data:", this.pageFilterTableData);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.pageRenderingTableData();
      console.log("currentPageChange data:", this.pageFilterTableData);
    },
    // 切换勾选
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    // 得到表格当中勾选的所有数据，这部分数据可供下载
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log("the choosed:", this.multipleSelection);
    }
  },
  // 失活钩子函数，当用户访问其他路由路径，离开了此页面，该失活钩子函数将被调用
  deactivated() {
    console.log("定时器被消除");
  },
};
</script>

<style scoped>
.line {
  height: 1.2px;
  background-color: #9b9b9b;
  margin: 20px 0px;
}

.gene_annotation_text {
  color: #676a6c;
  font-size: 13px;
  line-height: 25px;
}

.select_option_outer {
  text-align: left;
  margin-top: 30px;
  width: 100%;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px;
}

.select_option_inner {
  padding: 15px 20px;
}

.radio-box-spacin {
  margin: 0 20px 0 18px;
}

.table_outer {
  margin-top: 50px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px;
}

.table_inner {
  padding: 20px 40px;
}

.tick_download {
  float: left;
  border: 0;
  width: 100px;
  padding-left: 2px;
}

.download_all {
  float: left;
  border: 0;
  padding-left: 0px;
}

.table_filter {
  width: 260px; 
  float: right;
}

span {
  cursor: pointer;
}
</style>
