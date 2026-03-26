import type * as RDF from '@rdfjs/types';
import { BlankNode } from './BlankNode';
import { DefaultGraph } from './DefaultGraph';
import { Literal } from './Literal';
import { NamedNode } from './NamedNode';
import { Quad } from './Quad';
import { Variable } from './Variable';

let dataFactoryCounter = 0;

/**
 * A factory for instantiating RDF terms and quads.
 */
export class DataFactory<TQ extends RDF.BaseQuad = RDF.Quad> implements RDF.DataFactory<TQ> {
  private readonly blankNodePrefix: string;
  private blankNodeCounter = 0;

  public constructor(options?: IDataFactoryOptions) {
    options = options ?? {};
    this.blankNodePrefix = options.blankNodePrefix ?? `df_${dataFactoryCounter++}_`;
  }

  /**
   * @param value The IRI for the named node.
   * @return A new instance of NamedNode.
   * @see NamedNode
   */
  public namedNode<TIri extends string = string>(value: TIri): NamedNode<TIri> {
    return new NamedNode(value);
  }

  /**
   * @param value The optional blank node identifier.
   * @return A new instance of BlankNode.
   *         If the `value` parameter is undefined a new identifier
   *         for the blank node is generated for each call.
   * @see BlankNode
   */
  public blankNode(value?: string): BlankNode {
    return new BlankNode(value ?? `${this.blankNodePrefix}${this.blankNodeCounter++}`);
  }

  /**
   * @param value              The literal value.
   * @param languageOrDatatype The optional language, datatype, or directional language.
   *                           If `languageOrDatatype` is a NamedNode,
   *                           then it is used for the value of `NamedNode.datatype`.
   *                           If `languageOrDatatype` is a NamedNode, it is used for the value
   *                           of `NamedNode.language`.
   *                           Otherwise, it is used as a directional language,
   *                           from which the language is set to `languageOrDatatype.language`
   *                           and the direction to `languageOrDatatype.direction`.
   * @return A new instance of Literal.
   * @see Literal
   */
  public literal(value: string, languageOrDatatype?: string | RDF.NamedNode | RDF.DirectionalLanguage): Literal {
    return new Literal(value, languageOrDatatype);
  }

  /**
   * This method is optional.
   * @param value The variable name
   * @return A new instance of Variable.
   * @see Variable
   */
  public variable(value: string): Variable {
    return new Variable(value);
  }

  /**
   * @return An instance of DefaultGraph.
   */
  public defaultGraph(): DefaultGraph {
    return DefaultGraph.INSTANCE;
  }

  /**
   * @param subject   The quad subject term.
   * @param predicate The quad predicate term.
   * @param object    The quad object term.
   * @param graph     The quad graph term.
   * @return A new instance of Quad.
   * @see Quad
   */
  public quad(
    subject: TQ['subject'],
    predicate: TQ['predicate'],
    object: TQ['object'],
    graph?: TQ['graph'],
  ): TQ & Quad {
    return <TQ> new Quad(subject, predicate, object, graph ?? this.defaultGraph());
  }

  /**
   * Create a deep copy of the given term using this data factory.
   * @param original An RDF term.
   * @return A deep copy of the given term.
   */
  public fromTerm<T extends RDF.Term>(original: T): T {
    // TODO: remove nasty any casts when this TS bug has been fixed:
    //  https://github.com/microsoft/TypeScript/issues/26933
    switch (original.termType) {
      case 'NamedNode':
        // eslint-disable-next-line ts/no-unsafe-return
        return <any> this.namedNode(original.value);
      case 'BlankNode':
        // eslint-disable-next-line ts/no-unsafe-return
        return <any> this.blankNode(original.value);
      case 'Literal':
        if (original.language) {
          // eslint-disable-next-line ts/no-unsafe-return
          return <any> this.literal(original.value, original.language);
        }
        if (!original.datatype.equals(Literal.XSD_STRING)) {
          // eslint-disable-next-line ts/no-unsafe-return
          return <any> this.literal(original.value, this.fromTerm(original.datatype));
        }
        // eslint-disable-next-line ts/no-unsafe-return
        return <any> this.literal(original.value);
      case 'Variable':
        // eslint-disable-next-line ts/no-unsafe-return
        return <any> this.variable(original.value);
      case 'DefaultGraph':
        // eslint-disable-next-line ts/no-unsafe-return
        return <any> this.defaultGraph();
      case 'Quad':
        // eslint-disable-next-line ts/no-unsafe-return
        return <any> this.quad(
          <TQ['subject']> this.fromTerm((<TQ> <unknown> original).subject),
          <TQ['predicate']> this.fromTerm((<TQ> <unknown> original).predicate),
          <TQ['object']> this.fromTerm((<TQ> <unknown> original).object),
          <TQ['graph']> this.fromTerm((<TQ> <unknown> original).graph),
        );
    }
  }

  /**
   * Create a deep copy of the given quad using this data factory.
   * @param original An RDF quad.
   * @return A deep copy of the given quad.
   */
  public fromQuad(original: TQ): TQ {
    return this.fromTerm(original);
  }

  /**
   * Reset the internal blank node counter.
   */
  public resetBlankNodeCounter(): void {
    this.blankNodeCounter = 0;
  }
}

export interface IDataFactoryOptions {
  blankNodePrefix?: string;
}
