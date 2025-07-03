import {Chart} from '../../../../src/engine/chart/chart';

describe('Chart', () => {
  describe('name', () => {
    it('should return the name', () => {
      const chart = new Chart('', 'test', []);

      const result = chart.name;

      expect(result).toEqual('test');
    });
  });

  describe('symbols', () => {
    it('should return the symbols', () => {
      const chart = new Chart('', 'test', [
        {id: '1', type: 'start', label: 'test'},
      ]);

      const result = chart.symbols;

      expect(result).toEqual([{id: '1', type: 'start', label: 'test'}]);
    });
  });

  describe('getStartSymbol', () => {
    it('should return undefined if no start symbol exists', () => {
      const chart = new Chart('', 'test', []);

      const result = chart.getStartSymbol();

      expect(result).toBeUndefined();
    });

    it('should return the start symbol', () => {
      const chart = new Chart('', 'test', [
        {id: '1', type: 'start', label: 'test'},
        {id: '2', type: 'end', label: 'test'},
      ]);

      const result = chart.getStartSymbol();

      expect(result).toEqual({id: '1', type: 'start', label: 'test'});
    });
  });

  describe('getSymbolById', () => {
    it('should return undefined if no symbol with corresponding id exists', () => {
      const chart = new Chart('', 'test', []);

      const result = chart.getSymbolById('1');

      expect(result).toBeUndefined();
    });

    it('should return the symbol with the corresponding id', () => {
      const chart = new Chart('', 'test', [
        {id: '1', type: 'start', label: 'test'},
        {id: '2', type: 'end', label: 'test'},
      ]);

      const result = chart.getSymbolById('1');

      expect(result).toEqual({id: '1', type: 'start', label: 'test'});
    });
  });

  describe('getConnectionsBySourceId', () => {
    it('should return no connections if no symbol with corresponding source id exists', () => {
      const chart = new Chart('', 'test', [
        {
          id: '1',
          type: 'connection',
          label: 'test',
          mxCell: {source: '1', target: '1'},
        },
        {
          id: '2',
          type: 'connection',
          label: 'test',
          mxCell: {source: '2', target: '2'},
        },
      ]);

      const result = chart.getConnectionsBySourceId('3');

      expect(result).toEqual([]);
    });

    it('should return connections with the corresponding source id', () => {
      const chart = new Chart('', 'test', [
        {
          id: '1',
          type: 'connection',
          label: 'test',
          mxCell: {source: '1', target: '1'},
        },
        {
          id: '2',
          type: 'connection',
          label: 'test',
          mxCell: {source: '2', target: '2'},
        },
      ]);

      const result = chart.getConnectionsBySourceId('2');

      expect(result).toEqual([
        {
          id: '2',
          type: 'connection',
          label: 'test',
          mxCell: {source: '2', target: '2'},
        },
      ]);
    });
  });

  describe('getConnectionByTargetId', () => {
    it('should return no connection if no symbol with corresponding target id exists', () => {
      const chart = new Chart('', 'test', [
        {
          id: '1',
          type: 'connection',
          label: 'test',
          mxCell: {source: '1', target: '1'},
        },
        {
          id: '2',
          type: 'connection',
          label: 'test',
          mxCell: {source: '2', target: '2'},
        },
      ]);

      const result = chart.getConnectionByTargetId('3');

      expect(result).toBeUndefined;
    });

    it('should return the connection with the corresponding target id', () => {
      const chart = new Chart('', 'test', [
        {
          id: '1',
          type: 'connection',
          label: 'test',
          mxCell: {source: '1', target: '1'},
        },
        {
          id: '2',
          type: 'connection',
          label: 'test',
          mxCell: {source: '2', target: '2'},
        },
      ]);

      const result = chart.getConnectionByTargetId('2');

      expect(result).toEqual({
        id: '2',
        type: 'connection',
        label: 'test',
        mxCell: {source: '2', target: '2'},
      });
    });
  });

  describe('getConnectionBySourceId', () => {
    it('should return no connection if no symbol with corresponding source id exists', () => {
      const chart = new Chart('', 'test', [
        {
          id: '1',
          type: 'connection',
          label: 'test',
          mxCell: {source: '1', target: '1'},
        },
        {
          id: '2',
          type: 'connection',
          label: 'test',
          mxCell: {source: '2', target: '2'},
        },
      ]);

      const result = chart.getConnectionBySourceId('3');

      expect(result).toBeUndefined;
    });

    it('should return the connection with the corresponding source id', () => {
      const chart = new Chart('', 'test', [
        {
          id: '1',
          type: 'connection',
          label: 'test',
          mxCell: {source: '1', target: '1'},
        },
        {
          id: '2',
          type: 'connection',
          label: 'test',
          mxCell: {source: '2', target: '2'},
        },
      ]);

      const result = chart.getConnectionBySourceId('2');

      expect(result).toEqual({
        id: '2',
        type: 'connection',
        label: 'test',
        mxCell: {source: '2', target: '2'},
      });
    });
  });
});
